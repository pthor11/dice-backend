import { connect, Db, MongoClient } from "mongodb";
import { mongoUri } from "./config";

let client: MongoClient
let db: Db

const collectionNames = {
    events: 'events',
    bets: 'bets',
    users: 'users'
}

const connectDb = async () => {
    try {
        client = await connect(mongoUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            ignoreUndefined: true
        })

        client.on('error', async (e) => {
            try {
                await client.close()
                await connectDb()
            } catch (e) {
                setTimeout(connectDb, 1000)
                throw e
            }
        })

        client.on('timeout', async () => {
            try {
                await client.close()
                await connectDb()
            } catch (e) {
                setTimeout(connectDb, 1000)
                throw e
            }
        })

        client.on('close', async () => {
            try {
                await connectDb()
            } catch (e) {
                throw e
            }
        })

        db = client.db()

        console.log(`Mongodb Api: connected`)
    } catch (e) {
        console.error(`Mongodb Api: disconnected`)
        await client?.close(true)
        setTimeout(connectDb, 1000)
        throw e
    }
}

export {
    client,
    db, 
    connectDb,
    collectionNames
}