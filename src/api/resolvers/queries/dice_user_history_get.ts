import { collectionNames, db } from "../../mongo"

const dice_user_history_get = async (root: any, args: any, ctx: any) => {
    try {
        const address = args.address
        const page = args.page
        const pageSize = args.pageSize

        console.log({ address, page, pageSize });

        if (page < 0 || pageSize < 0) throw new Error(`invalid page or pageSize`)

        const bets = await db.collection(collectionNames.bets).find({ address, result: { $exists: true } }).sort({ "data.blockNumber": -1 }).limit(pageSize).skip(page * pageSize).toArray()

        const history = bets.map(bet => {
            return {
                type: bet.data.type,
                modulo: bet.data.modulo,
                value: bet.data.value,
                multiplier: Number(98 / (bet.data.modulo < bet.result ? bet.data.modulo : 99 - bet.data.modulo)).toFixed(2),
                result: bet.result,
                payout: bet.payout,
                time: bet.data.blockTime
            }
        })

        return history
    } catch (e) {
        throw e
    }
}

export { dice_user_history_get }