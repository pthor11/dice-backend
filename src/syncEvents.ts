import axios from "axios"
import { collectionNames, db } from "./mongo"
import { contract, fullHost } from "./config"

const getAllEvents = async (_fingerprint?: string, _events: any[] = []) => {
    try {
        let url = `${fullHost}/v1/contracts/${contract}/events?only_confirmed=true&event_name=Bet&limit=1`

        if (_fingerprint) url += `&fingerprint=${_fingerprint}`

        // console.log({ url })

        const { data } = await axios.get(url)

        // console.log({ data })

        const events = data.data

        const fingerprint = data.meta?.fingerprint

        return fingerprint ? getAllEvents(fingerprint, [..._events, ...events]) : [..._events, ...events]
    } catch (e) {
        console.error(e.response?.data || e.message)
        throw e
    }
}
const updateEvents = async (_fingerprint?: string, _events: any[] = [], refEvent?: any) => {
    try {
        if (!refEvent) refEvent = await db.collection(collectionNames.events).findOne({}, { sort: { "raw.block_number": -1 }, limit: 1 })

        // console.log({ refEvent })

        let url = `${fullHost}/v1/contracts/${contract}/events?only_confirmed=true&event_name=Bet&limit=1`

        if (_fingerprint) url += `&fingerprint=${_fingerprint}`

        const { data } = await axios.get(url)

        // console.log({ data })

        const events = data.data

        if (events.find(event => event.transaction_id === refEvent.raw.transaction_id)) return events.filter(event => event.block_number > refEvent.raw.block_number)

        const fingerprint = data.meta?.fingerprint

        return fingerprint ? updateEvents(fingerprint, [..._events, ...events]) : [..._events, ...events]
    } catch (e) {
        throw e
    }
}


const syncEvents = async () => {
    try {
        const count = await db.collection(collectionNames.events).estimatedDocumentCount()

        const events = count ? await updateEvents() : await getAllEvents()

        if (events.length > 0) {
            console.log({ count, events: events.length })

            await db.collection(collectionNames.events).insertMany(events.map(event => {
                return {
                    processed: false,
                    raw: event,
                    createdAt: new Date()
                }
            }))

            console.log(`syncEvents`, events.length);
        }

        setTimeout(syncEvents, 1000)
    } catch (e) {
        setTimeout(syncEvents, 1000)
        throw e
    }
}

export { syncEvents }