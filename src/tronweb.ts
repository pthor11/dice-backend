import TronWeb from "tronweb";
import { fullHost, privateKey, contract } from "./config";

const tronweb = new TronWeb({
    fullHost: fullHost,
    privateKey: privateKey
})

let diceContract: any

const getDiceContract = async () => {
    try {
        diceContract = await tronweb.contract().at(contract)
        console.log(`Dice contract reached`)
    } catch (e) {
        throw e
    }
}

export {
    tronweb,
    diceContract,
    getDiceContract
}