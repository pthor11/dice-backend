import { IndexSpecification } from "mongodb";

type Event = {
    processed: boolean
    raw: any
    updatedAt: Date
    createdAt: Date
}

const EventIndexes: IndexSpecification[] = [
    { key: { "raw.transaction_id": 1 }, unique: true },
    { key: { "raw.block_number": 1 } },
    { key: { processed: 1 } },
]

export {
    Event,
    EventIndexes
}