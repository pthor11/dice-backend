import { withFilter } from "apollo-server";
import { pubsub, subtopic } from "./pubsub";

const dice_activities_subscription = {
    subscribe: withFilter(() => pubsub.asyncIterator(subtopic.new_bet), (payload) => {
        console.log({ payload })

        return payload.payout > 0
    }),
    resolve: (payload) => {
        return {
            address: payload.address,
            payout: payload.payout,
            updatedAt: payload.updatedAt
        }
    }
}

export { dice_activities_subscription }