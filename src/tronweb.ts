import TronWeb from "tronweb";
import { fullHost, privateKey, contract } from "./config";

const tronweb = new TronWeb({
    fullHost: fullHost,
    privateKey: privateKey
})

let DiceContract: any

const getDiceContract = async () => {
    try {
        DiceContract = await tronweb.contract().at(contract)
        console.log(`Dice contract reached`)
    } catch (e) {
        throw e
    }
}

export {
    tronweb,
    getDiceContract,
    DiceContract
}