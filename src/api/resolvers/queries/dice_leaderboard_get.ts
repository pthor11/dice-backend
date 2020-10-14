import { collectionNames, db } from "../../mongo"

const dice_leaderboard_get = async (root: any, args: any, ctx: any) => {
    try {
        const quantity = args.quantity

        console.log({ quantity });

        if (quantity <= 0) throw new Error(`invalid quantity`)

        const users = await db.collection(collectionNames.users).find({}).sort({ totalWager: -1 }).limit(args.quantity).toArray()

        console.log({ users })

        return users
    } catch (e) {
        throw e
    }
}

export { dice_leaderboard_get }