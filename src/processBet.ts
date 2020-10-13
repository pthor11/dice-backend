import axios from "axios";
import { Bet, Revert } from "./models/Bet"
import { client, collectionNames, db } from "./mongo"
import { DiceContract, tronweb } from "./tronweb"
import { fullHost } from "./config";
import { decodeSettleResult } from "./util";

const getLatestBlockHash = async (): Promise<string> => {
    try {
        const { data } = await axios.get(`${fullHost}/v1/blocks/latest`)
        const blockHash = data.data?.[0]?.block_id
        if (!blockHash) throw new Error(`get latest block hash error`)
        return blockHash
    } catch (e) {
        throw e
    }
}


const processBet = async () => {
    const session = client.startSession()
    session.startTransaction()

    try {
        const bet: Bet | null = await db.collection(collectionNames.bets).findOne({
            result: { $exists: false },
            revert: { $exists: false }
        }, { session, sort: { "data.blockNumber": 1 } })

        if (bet) {
            console.log({ bet })

            if (!bet.settleTx && !bet.adminSettleTx) {
                const settleTx = await DiceContract.settle(bet.address).send({ calValue: 0 })

                console.log({ settleTx })

                await db.collection(collectionNames.bets).updateOne({ _id: bet._id }, {
                    $set: {
                        settleTx,
                        updatedAt: new Date()
                    }
                }, { session })

                await session.commitTransaction()

            } else if (bet.settleTx || bet.adminSettleTx) {
                const settle = await decodeSettleResult({ tx: bet.adminSettleTx ? bet.adminSettleTx! : bet.settleTx! })

                console.log({ settle })

                const revert = settle['revert']
                const result = settle['result']
                const payout = settle['payout']

                console.log({ revert, result, payout })

                if (settle === 'pending') {
                    await session.abortTransaction()

                } else if (revert) {
                    if (revert === Revert["Must be have bet"]) {
                        await db.collection(collectionNames.bets).updateOne({ _id: bet._id }, {
                            $set: {
                                revert,
                                updatedAt: new Date()
                            }
                        }, { session })

                    } else if (revert === Revert["blockhash valid time"]) {

                        const blockHash = await getLatestBlockHash()
                        console.log({ blockHash })

                        const adminSettleTx = await DiceContract.adminSettle(bet.address, `0x${blockHash}`).send({ calValue: 0 })

                        console.log({ adminSettleTx })

                        await db.collection(collectionNames.bets).updateOne({ _id: bet._id }, {
                            $set: {
                                adminSettleTx,
                                updatedAt: new Date()
                            }
                        }, { session })
                    }

                    await session.commitTransaction()

                } else if (!revert) {

                    await db.collection(collectionNames.bets).updateOne({ _id: bet._id }, {
                        $set: {
                            result,
                            payout
                        }
                    }, { session })

                    await db.collection(collectionNames.users).updateOne({ address: bet.address }, {
                        $set: {
                            updatedAt: new Date()
                        },
                        $unset: { currentBet: '' }
                    }, { session })

                    await session.commitTransaction()
                } 
            }

            session.endSession()
        } else {
            await session.abortTransaction()
        }

        session.endSession()

        setTimeout(processBet, 1000)
    } catch (e) {
        await session.abortTransaction()
        session.endSession()

        setTimeout(processBet, 1000)

        throw e
    }
}

export { processBet }