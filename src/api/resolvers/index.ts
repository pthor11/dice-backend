import { dice_user_get } from "./queries/dice_user_get";
import { dice_leaderboard_get } from "./queries/dice_leaderboard_get";
import { dice_activities_get } from "./queries/dice_activities_get";

const resolvers = {
    Query: {
        dice_user_get,
        dice_leaderboard_get,
        dice_activities_get
    }
}

export { resolvers }