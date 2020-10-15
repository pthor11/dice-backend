import { dice_user_get } from "./queries/dice_user_get";
import { dice_leaderboard_get } from "./queries/dice_leaderboard_get";
import { dice_activities_get } from "./queries/dice_activities_get";
import { dice_user_history_get } from "./queries/dice_user_history_get";
import { dice_user_subscription } from "./subscriptions/dice_user_subscription";
import { dice_activities_subscription } from "./subscriptions/dice_activities_subscription";

const resolvers = {
    Query: {
        dice_user_get,
        dice_leaderboard_get,
        dice_activities_get,
        dice_user_history_get
    },
    Subscription: {
        dice_user_subscription,
        dice_activities_subscription
    }
}

export { resolvers }