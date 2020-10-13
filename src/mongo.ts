import { connect, Db, MongoClient } from "mongodb";
import { mongoUri } from "./config";
import { EventIndexes } from "./models/Event";
import { BetIndexes } from "./models/Bet";
import { UserIndexes } from "./models/User";

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

        await Promise.all([
            db.collection(collectionNames.events).createIndexes(EventIndexes),
            db.collection(collectionNames.bets).createIndexes(BetIndexes),
            db.collection(collectionNames.users).createIndexes(UserIndexes),
        ])

        console.log(`Mongodb: connected`)
    } catch (e) {
        console.error(`Mongodb: disconnected`)
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