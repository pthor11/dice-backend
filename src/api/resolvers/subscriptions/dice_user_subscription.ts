import { withFilter } from "apollo-server";
import { pubsub, subtopic } from "./pubsub";

const dice_user_subscription = {
    subscribe: withFilter(() => pubsub.asyncIterator(subtopic.new_bet), (payload, variables) => {
        console.log({ payload })

        const address = variables.address

        if (!address) throw new Error(`address must be provided`)

        return variables.address === payload.address
    }),
    resolve: (payload) => {
        return {
            type: payload.data.type,
            modulo: payload.data.modulo,
            value: payload.data.value,
            multiplier: Number(98 / (payload.data.modulo < payload.result ? payload.data.modulo : 99 - payload.data.modulo)).toFixed(2),
            result: payload.result,
            payout: payload.payout,
            time: payload.data.blockTime
        }
    }
}

export { dice_user_subscription }