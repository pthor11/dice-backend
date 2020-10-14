import { collectionNames, db } from "../../mongo";

const dice_activities_get = async (root: any, args: any, ctx: any) => {
    try {
        const quantity = args.quantity

        console.log({ quantity });

        if (quantity <= 0) throw new Error(`invalid quantity`)

        const bets = await db.collection(collectionNames.bets).find({ payout: { $gt: 0 } }).sort({ "data.blockNumber": -1 }).limit(quantity).toArray()

        // console.log({ bets })

        return bets
    } catch (e) {
        throw e
    }
}

export { dice_activities_get }