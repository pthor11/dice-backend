import { connectDb } from "./mongo";
import { processEvent } from "./processEvent";
import { syncEvents } from "./syncEvents";
import { getDiceContract, tronweb } from "./tronweb"
const TronTxDecoder = require('tron-tx-decoder');

const decoder = new TronTxDecoder({ mainnet: false });

// const txid = '2cac49987304cb004d5e29510a29b5598cb455d9524f16350225213bbd5e2192'
// const txid = '7537e39f03b62c81b97a371cd955dee5c4793591d2389f1ac322d3f770591b99'
// const txid = 'e6feab04c8c31f86df58f728c96f6203ff2c1a1272f15735f4a6af25b3f09c8e'
// const txid = '0fb11ba4703bd3dc57d1e2f3df8a4f6df8c6ff2e2b065a9f7f43ce1ff2b0248e'

const decodeTx = async (txid: string) => {
    try {
        const decodedOuput = await decoder.decodeRevertMessage(txid)

        console.log({ decodedOuput });

    } catch (e) {
        throw e
    }
}

const start = async () => {
    try {
        // await decodeTx('1c87305512d6f1f683ece6eff78534ebacbf6eb86fdb2a9b4e8bbf4dd2805c2a')

        await connectDb()

        await getDiceContract()

        await syncEvents()

        await processEvent()
    } catch (e) {
        console.error(e)
    }
}

start()