import { withFilter } from "apollo-server";
import { pubsub } from "./pubsub";

const dice_user_subscription = {
    subscribe: withFilter(() => pubsub.asyncIterator('dice_user_subscription'), (payload, variables) => {
        const address = variables.address

        if (!address) throw new Error(`address must be provided`)

        return variables.slug === payload.address
    }),
    resolve: payload => payload
}

export { dice_user_subscription }