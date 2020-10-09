import TronWeb from "tronweb";
import { fullHost, privateKey } from "./config";

const tronweb = new TronWeb({
    fullHost: fullHost,
    privateKey: privateKey
})

export { tronweb }