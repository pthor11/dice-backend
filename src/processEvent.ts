import { collectionNames, db } from "./mongo"
import { diceContract } from "./tronweb"

const processEvent = async () => {
    try {
        const unprocessedEvent = await db.collection(collectionNames.events).findOne({
            processed: false
        }, {
            sort: { "raw.block_number": 1 },
            limit: 1
        })

        console.log({ unprocessedEvent })

        // const result = await diceContract.settle(unprocessedEvent.raw.result.user).send({ calValue: 0 })

        // console.log({ result })
    } catch (e) {
        throw e
    }
}

export { processEvent }