import { gql } from "apollo-server";

export const typeDefs = gql`

scalar ObjectID
scalar Date

type User {
    address: String!
    totalWager: Float!
    currentBet: ObjectID
}

type Activity {
    address: String!
    payout: Int!
    updatedAt: Date!
}

type Bet {
    type: Int!
    modulo: Int!
    value: Int!
    multiplier: Float!
    result: Int!
    payout: Int!
    time: Date!
}

type Query {
    dice_user_get(address: String!): User
    dice_leaderboard_get(quantity: Int!): [User!]!
    dice_activities_get(quantity: Int!): [Activity!]!
    dice_user_history_get(address: String!, page: Int!, pageSize: Int!): [Bet!]!
}

type Subscription {
    dice_user_subscription(address: String!): Bet
}

`