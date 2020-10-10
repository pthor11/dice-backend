import { client, collectionNames, db } from "./mongo"
import { DiceContract } from "./tronweb"

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
            const address = unprocessedEvent.raw.result.user

            const bet: Bet = {
                address,
                data: {
                    type: 0,
                    modulo: 50,
                    value: 1000
                },
                betTx: unprocessedEvent.raw.transaction_id,
                updatedAt: new Date(),
                createdAt: new Date()
            }

            const { insertedId } = await db.collection(collectionNames.bets).insertOne(bet, { session })

            await db.collection(collectionNames.users).updateOne({ address }, {
                $set: {
                    currentBet: insertedId,
                    updatedAt: new Date()
                }
            }, { session })
            // const result = await diceContract.settle(unprocessedEvent.raw.result.user).send({ calValue: 0 })

            // console.log({ result })
        }

        await session.commitTransaction()

        session.endSession()

        setTimeout(processEvent, 1000)
    } catch (e) {
        setTimeout(processEvent, 1000)
        await session.abortTransaction()
        session.endSession()

        throw e
    }
}

export { processEvent }