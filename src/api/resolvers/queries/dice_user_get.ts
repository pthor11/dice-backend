const dice_user_get = async (root: any, args: any, ctx: any) => {
    try {
        const user = {
            address: '',
            totalWager: 0,
            currentBet: undefined
        }
        return user
    } catch (e) {
        throw e
    }
}

export { dice_user_get }