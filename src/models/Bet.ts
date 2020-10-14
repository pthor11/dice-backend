import { IndexSpecification, ObjectID } from "mongodb"

enum Revert {
    'Must be have bet' = 'Must be have bet',
    'blockhash valid time' = 'blockhash valid time'
}

type BetData = {
    type: number
    modulo: number
    value: number
    blockNumber: number
    blockTime: Date
}

type Bet = {
    _id?: ObjectID
    address: string
    data: BetData
    result?: number
    payout?: number
    revert?: string
    betTx: string
    settleTx?: string
    adminSettleTx?: string
    updatedAt: Date
    createdAt: Date
}

const BetIndexes: IndexSpecification[] = [
    { key: { address: 1 } },
    { key: { betTx: 1 }, unique: true, partialFilterExpression: { betTx: { $exists: true } } },
    { key: { settleTx: 1 }, unique: true, partialFilterExpression: { settleTx: { $exists: true } } },
    { key: { adminSettleTx: 1 }, unique: true, partialFilterExpression: { adminSettleTx: { $exists: true } } },
    { key: { "data.blockNumber": 1 } }
]


export {
    Bet,
    Revert,
    BetData,
    BetIndexes
}