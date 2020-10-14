import { gql } from "apollo-server";

export const typeDefs = gql`

scalar ObjectID

type User {
    address: String!
    totalWager: Float!
    currentBet: ObjectID
}


type Query {
    dice_user_get(address: String!): User
    dice_leaderboard_get(quantity: Int!): [User!]!
    # dice_activities_get(quantity: Int!): JSON
}

`