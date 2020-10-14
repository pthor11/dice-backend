import { collectionNames, db } from "../../mongo"

const dice_user_get = async (root: any, args: any, ctx: any) => {
    try {
        console.log('haha', args.address);

        const user = await db.collection(collectionNames.users).findOne({ address: args.address })

        console.log({ user });

        return user
    } catch (e) {
        throw e
    }
}

export { dice_user_get }