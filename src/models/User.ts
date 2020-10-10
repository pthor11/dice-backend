import { ObjectID, IndexSpecification } from "mongodb";

type User = {
    address: string
    currentBet: ObjectID
    updatedAt: Date
    createdAt: Date
}

const UserIndexes: IndexSpecification[] = [
    { key: { address: 1 }, unique: true },
    { key: { currentBet: 1 }, partialFilterExpression: { currentBet: { $exists: true } } },
]

export {
    User,
    UserIndexes
}