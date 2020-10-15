import { pubsub, subtopic } from "./pubsub";

const dice_activities_subscription = {
    subscribe: () => pubsub.asyncIterator(subtopic.new_bet),
    resolve: (payload) => {
        return {
            address: payload.address,
            payout: payload.payout,
            updatedAt: payload.updatedAt
        }
    }
}

export { dice_activities_subscription }