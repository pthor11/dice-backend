import Web3 from "web3";
import BN from "bignumber.js";
import TronTxDecoder from 'tron-tx-decoder';

const web3 = new Web3()

const decoder = new TronTxDecoder({ mainnet: false })

const decodeSettleResult = async (params: { tx: string }): Promise<{ result: number, payout: number } | 'pending' | { revert: string }> => {
    try {
        console.log({ decodeSettleResult: params.tx });

        const [decodedResult, decodedRevert] = await Promise.all([
            decoder.decodeResultById(params.tx),
            decoder.decodeRevertMessage(params.tx)
        ])

        console.log('decodedResult', decodedResult)
        console.log('decodedRevert', decodedRevert)

        if (!decodedResult || !decodedRevert) return 'pending'

        const result = decodedResult?.decodedOutput?.['0']
        const payout = decodedResult?.decodedOutput?.['1']
        const txStatus = decodedRevert?.txStatus

        if (txStatus === 'SUCCESS') return {
            result: new BN(result).toNumber(),
            payout: new BN(payout).toNumber()
        }

        return { revert: decodedRevert.revertMessage }
    } catch (e) {
        console.error(e)
        if (e.message === 'Transaction not found') return 'pending'
        if (e.message === `Cannot read property '0' of undefined`) return 'pending'
        throw e
    }
}

const decodeBetData = (data: string): { type: number, modulo: number, value: number } => {
    const number = new BN(data)
    const type = number.mod(10).toNumber()
    const value = Number(number.div(10 ** 23).toFixed(0))
    const modulo = Number(number.mod(1000).dividedBy(10).toFixed(0))

    return {
        type,
        modulo,
        value
    }
}

const calculateBetResult = (params: { address: string, blockHash: string, betData: number }): number => {
    if (!params.address) throw new Error(`calculateBetResult address notfound`)
    if (!params.blockHash) throw new Error(`calculateBetResult blockHash notfound`)
    if (!params.betData) throw new Error(`calculateBetResult betData notfound`)

    const value = new BN(params.betData).mod(10 ** 23).div(10 ** 13).toFixed(0)
    console.log({ value });

    const hex = web3.utils.soliditySha3Raw({ type: 'address', value: params.address }, { type: 'bytes32', value: params.blockHash }, { type: 'uint256', value })

    const result = new BN(hex!).mod(100).toNumber()

    return result
}

export {
    decodeBetData,
    decodeSettleResult,
    calculateBetResult
}