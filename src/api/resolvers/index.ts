import { dice_user_get } from "./queries/dice_user_get";
import { dice_leaderboard_get } from "./queries/dice_leaderboard_get";

const resolvers = {
    Query: {
        dice_user_get,
        dice_leaderboard_get
    }
}

export { resolvers }