type BetData = {
    type: number
    modulo: number
    value: number
}

type Bet = {
    address: string
    data: BetData
    betTx: string
    settleTx?: string
    settleAdminTx?: string
    updatedAt: Date
    createdAt: Date
}
