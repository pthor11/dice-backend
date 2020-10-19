import { IndexSpecification } from "mongodb";

const EventName = {
    'Bet': 'Bet',
    'BetSettle': 'BetSettle'
}

type BetEventResult = {
    user: string
    data: string
}
type BetSettleEventResult = {
    user: string
    result: string
    payout: string
}

type Event = {
    source: string
    processed: boolean
    raw: any
    updatedAt: Date
    createdAt: Date
}

const EventIndexes: IndexSpecification[] = [
    { key: { "raw.transaction": 1 }, unique: true },
    { key: { "raw.block": 1 } },
    { key: { processed: 1 } },
]

export {
    Event,
    EventName,
    BetEventResult,
    BetSettleEventResult,
    EventIndexes
}