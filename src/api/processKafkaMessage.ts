import { EachMessagePayload } from "kafkajs"
import { ObjectID } from "mongodb"
import { db, collectionNames } from "./mongo"
import { pubsub } from "./resolvers/subscriptions/pubsub"

type KafkaMessage = {
    _id: ObjectID
    address: string
    data: {
        type: number
        modulo: number
        value: number
        blockNumber: number
        blockTime: Date
    }
    betTx: string
    settleTx: string
    adminSettleTx?: string
    result: number
    payout: number
    updatedAt: Date
}

const processKafkaMessage = async (payload: EachMessagePayload) => {
    try {
        const { message } = payload
        const dataString = message.value?.toString()

        if (!dataString) throw new Error(`kafka message no value`)

        const data = JSON.parse(dataString) as KafkaMessage

        data.data.blockTime = new Date(data.data.blockTime)
        data.updatedAt = new Date(data.updatedAt)

        console.log({ data })

        pubsub.publish('dice_user_subscription', data)
    } catch (e) {
        throw e
    }
}


export { processKafkaMessage }