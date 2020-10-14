import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

const path = join(__dirname, `../../.service.env`)

if (existsSync(path)) {
    config({ path })
} else {
    config()
}

if (!process.env.FULL_HOST) throw new Error(`full host must be provided`)
export const fullHost = process.env.FULL_HOST

if (!process.env.PRIVATEKEY) throw new Error(`private key must be provided`)
export const privateKey = process.env.PRIVATEKEY

if(!process.env.CONTRACT) throw new Error(`contract must be provided`)
export const contract = process.env.CONTRACT

if (!process.env.MONGO_URI) throw new Error(`mongo uri must be provided`)
export const mongoUri = process.env.MONGO_URI

if (!process.env.KAFKA_CLIENT_ID_SERVICE) throw new Error(`Kafka client id service must be provided`)
if (!process.env.KAFKA_TOPIC_SETTLE) throw new Error(`Kafka topic settle must be provided`)
if (!process.env.KAFKA_BROKERS) throw new Error(`Kafka brokers must be provided`)
if (process.env.KAFKA_MECHANISM && !process.env.KAFKA_USERNAME) throw new Error(`Kafka username must be provided with mechanism ${process.env.KAFKA_MECHANISM}`)
if (process.env.KAFKA_MECHANISM && !process.env.KAFKA_PASSWORD) throw new Error(`Kafka password must be provided with mechanism ${process.env.KAFKA_MECHANISM}`)

export const kafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID_SERVICE,
    brokers: process.env.KAFKA_BROKERS,
    mechanism: process.env.KAFKA_MECHANISM,
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    topic: {
        settle: process.env.KAFKA_TOPIC_SETTLE
    }
}