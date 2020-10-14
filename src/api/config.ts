import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

const path = join(__dirname, `../../.api.env`)

if (existsSync(path)) {
    config({ path })
} else {
    config()
}

if (!process.env.PORT) throw new Error(`port must be provided`)
export const port = process.env.PORT

if (!process.env.MONGO_URI) throw new Error(`mongo uri must be provided`)
export const mongoUri = process.env.MONGO_URI

if (!process.env.KAFKA_CLIENT_ID_API) throw new Error(`Kafka client id api must be provided`)
if (!process.env.KAFKA_GROUP_ID) throw new Error(`Kafka group id api must be provided`)
if (!process.env.KAFKA_TOPIC_SETTLE) throw new Error(`Kafka topic settle must be provided`)
if (!process.env.KAFKA_BROKERS) throw new Error(`Kafka brokers must be provided`)
if (process.env.KAFKA_MECHANISM && !process.env.KAFKA_USERNAME) throw new Error(`Kafka username must be provided with mechanism ${process.env.KAFKA_MECHANISM}`)
if (process.env.KAFKA_MECHANISM && !process.env.KAFKA_PASSWORD) throw new Error(`Kafka password must be provided with mechanism ${process.env.KAFKA_MECHANISM}`)

export const kafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID_API,
    groupId: process.env.KAFKA_GROUP_ID,
    brokers: process.env.KAFKA_BROKERS,
    mechanism: process.env.KAFKA_MECHANISM,
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    topic: {
        settle: process.env.KAFKA_TOPIC_SETTLE
    }
}