/* 
    //Currency: 0:TRX
    //Type: 0:Under 1:Over
    //Modulo: Number compare
    //Value: Bet value
    //Save
    //Data: %10 => type ;%1000/10 => number; %10**13/1000 => blocknumber ;/10**23 => value; %10**23/10**13 => blocktime

uint dataBet = _value *
            10**23 +
            block.number *
            1000 +
            _modulo *
            10 +
            _direction;
*/

import BN from "bignumber.js";
import TronTxDecoder from 'tron-tx-decoder';


const decoder = new TronTxDecoder({ mainnet: false })

const decodeSettleResult = async (params: { tx: string }): Promise<{ result: number, payout: number } | 'pending' | { revert: string }> => {
    try {
        console.log({ decodeSettleResult: params.tx });

        const [decodedResult, decodedRevert] = await Promise.all([
            decoder.decodeResultById(params.tx),
            decoder.decodeRevertMessage(params.tx)
        ])

        if (!decodedResult || !decodedRevert) return 'pending'

        console.log({ decodedResult, decodedRevert })

        const result = decodedResult?.decodedOutput?.['0']
        const payout = decodedResult?.decodedOutput?.['1']
        const txStatus = decodedRevert?.txStatus

        if (txStatus === 'SUCCESS') return {
            result: new BN(result).toNumber(),
            payout: new BN(payout).toNumber()
        } 

        return { revert: decodedRevert.revertMessage }
    } catch (e) {
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

export {
    decodeBetData,
    decodeSettleResult
}

// console.log(decodeBetData("10000000000000008809293500"))
// decodeSettleResult({ tx: '137e0ad4545ea8e9c50990a7ce090181ceedae63d62822201489638fcdf8f878' }).then(console.log)
// decodeSettleResult({ tx: '137e0ad4545ea8e9c50990a7ce090181ceedae63d62822201489638fcdf8f878' }).then(console.log)