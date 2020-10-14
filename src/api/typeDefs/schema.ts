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
}

`