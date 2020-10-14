import { connectDb } from "./mongo";
import { processEvent } from "./processEvent";
import { processBet } from "./processBet";
import { syncEvents } from "./syncEvents";
import { getDiceContract } from "./tronweb"
import { connectKafkaProducer } from "./kafka";

const start = async () => {
    try {
        await connectDb()

        await connectKafkaProducer()

        await getDiceContract()

        await syncEvents()

        await processEvent()

        await processBet()
    } catch (e) {
        console.error(e)
    }
}

start()