import axios from "axios"
import { collectionNames, db } from "./mongo"
import { contract, fullHost } from "./config"

const getAllEvents = async (_fingerprint?: string, _events: any[] = []) => {
    try {
        // let url = `${fullHost}/v1/contracts/${contract}/events?only_confirmed=true&event_name=Bet&limit=1`
        let url = `${fullHost}/v1/contracts/${contract}/events?event_name=Bet&limit=1`

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

        // let url = `${fullHost}/v1/contracts/${contract}/events?only_confirmed=true&event_name=Bet&limit=1`
        let url = `${fullHost}/v1/contracts/${contract}/events?event_name=Bet&limit=1`

        if (_fingerprint) url += `&fingerprint=${_fingerprint}`

        // console.log({ url })

        const { data } = await axios.get(url)

        // console.log({ data })

        const events = data.data

        const totalEvents = [..._events, ...events]

        if (totalEvents.find(event => event.transaction_id === refEvent.raw.transaction_id)) return totalEvents.filter(event => event.block_number > refEvent.raw.block_number)

        const fingerprint = data.meta?.fingerprint

        // console.log({ fingerprint })

        return fingerprint ? updateEvents(fingerprint, totalEvents) : totalEvents

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

        setTimeout(syncEvents, 2000)
    } catch (e) {
        setTimeout(syncEvents, 2000)
        console.error(e.response?.data.error || e.message)
    }
}

export { syncEvents }