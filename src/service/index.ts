import { connectDb } from "./mongo";
import { syncEvents } from "./syncEvents";
import { getDiceContract } from "./tronweb"

const start = async () => {
    try {
        await connectDb()

        await getDiceContract()

        await syncEvents()
    } catch (e) {
        console.error(e)
    }
}

start()