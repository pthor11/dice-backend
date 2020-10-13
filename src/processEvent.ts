import { client, collectionNames, db } from "./mongo"
import { Bet } from "./models/Bet"
import { DiceContract, tronweb } from "./tronweb"
import { decodeBetData } from "./util"

const processEvent = async () => {
    const session = client.startSession()
    session.startTransaction()

    try {
        const unprocessedEvent = await db.collection(collectionNames.events).findOne({
            processed: false
        }, {
            sort: { "raw.block_number": 1 },
            limit: 1
        })

        if (unprocessedEvent) {
            let address = unprocessedEvent.raw?.result?.user
            const data = unprocessedEvent.raw?.result?.data
            const betTx = unprocessedEvent.raw.transaction_id
            const block_number = unprocessedEvent.raw.block_number
            const block_time = unprocessedEvent.raw.block_timestamp

            if (!address) throw new Error(`address not found in bet event`)
            if (!data) throw new Error(`data not found in bet event`)
            if (!betTx) throw new Error(`transaction_id not found in bet event`)
            if (!block_number) throw new Error(`block_number not found in bet event`)
            if (!block_time) throw new Error(`block_time not found in bet event`)

            address = tronweb.address.fromHex(address)

            const { type, modulo, value } = decodeBetData(data)

            const bet: Bet = {
                address,
                data: {
                    type,
                    modulo,
                    value,
                    blockNumber: block_number,
                    blockTime: new Date(block_time)
                },
                betTx,
                updatedAt: new Date(),
                createdAt: new Date()
            }

            const { insertedId } = await db.collection(collectionNames.bets).insertOne(bet, { session })

            console.log({ insertedId })

            const user = await db.collection(collectionNames.users).findOneAndUpdate({ address }, {
                $set: {
                    currentBet: insertedId,
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            }, {
                returnOriginal: false,
                upsert: true,
                session
            })

            console.log({ user })

            await db.collection(collectionNames.events).updateOne({ _id: unprocessedEvent._id }, {
                $set: {
                    processed: true,
                    updatedAt: new Date()
                }
            }, { session })

            await session.commitTransaction()
        } else {
            await session.abortTransaction()
        }

        session.endSession()

        setTimeout(processEvent, 1000)
    } catch (e) {
        await session.abortTransaction()
        session.endSession()
        setTimeout(processEvent, 1000)
        throw e
    }
}

export { processEvent }