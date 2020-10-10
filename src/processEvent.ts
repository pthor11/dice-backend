import { collectionNames, db } from "./mongo"
import { DiceContract } from "./tronweb"

const processEvent = async () => {
    try {
        const unprocessedEvent = await db.collection(collectionNames.events).findOne({
            processed: false
        }, {
            sort: { "raw.block_number": 1 },
            limit: 1
        })

        if (unprocessedEvent) {
            // const result = await diceContract.settle(unprocessedEvent.raw.result.user).send({ calValue: 0 })

            // console.log({ result })
        }

        setTimeout(processEvent, 1000)
    } catch (e) {
        setTimeout(processEvent, 1000)
        throw e
    }
}

export { processEvent }