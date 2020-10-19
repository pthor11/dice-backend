import axios from "axios"
import { client, collectionNames, db } from "./mongo"
import { contract, fullHost } from "./config"
import { DiceContract, tronweb } from "./tronweb"
import { BetEventResult, BetSettleEventResult, EventName } from "./models/Event"
import { decodeBetData } from "./util"
import { Bet } from "./models/Bet"

// const getAllEvents = async (_fingerprint?: string, _events: any[] = []) => {
//     try {
//         // let url = `${fullHost}/v1/contracts/${contract}/events?only_confirmed=true&event_name=Bet&limit=1`
//         let url = `${fullHost}/v1/contracts/${contract}/events?event_name=Bet&limit=1`

//         if (_fingerprint) url += `&fingerprint=${_fingerprint}`

//         // console.log({ url })

//         const { data } = await axios.get(url)

//         // console.log({ data })

//         const events = data.data

//         const fingerprint = data.meta?.fingerprint

//         return fingerprint ? getAllEvents(fingerprint, [..._events, ...events]) : [..._events, ...events]
//     } catch (e) {
//         console.error(e.response?.data || e.message)
//         throw e
//     }
// }
// const updateEvents = async (_fingerprint?: string, _events: any[] = [], refEvent?: any) => {
//     try {
//         if (!refEvent) refEvent = await db.collection(collectionNames.events).findOne({}, { sort: { "raw.block_number": -1 }, limit: 1 })

//         // console.log({ refEvent })

//         // let url = `${fullHost}/v1/contracts/${contract}/events?only_confirmed=true&event_name=Bet&limit=1`
//         let url = `${fullHost}/v1/contracts/${contract}/events?event_name=Bet&limit=1`

//         if (_fingerprint) url += `&fingerprint=${_fingerprint}`

//         // console.log({ url })

//         const { data } = await axios.get(url)

//         // console.log({ data })

//         const events = data.data

//         const totalEvents = [..._events, ...events]

//         if (totalEvents.find(event => event.transaction_id === refEvent.raw.transaction_id)) return totalEvents.filter(event => event.block_number > refEvent.raw.block_number)

//         const fingerprint = data.meta?.fingerprint

//         // console.log({ fingerprint })

//         return fingerprint ? updateEvents(fingerprint, totalEvents) : totalEvents

//     } catch (e) {
//         throw e
//     }
// }

const processBetEvent = async (betTx: string, result: BetEventResult) => {
    console.log({ processBetEvent: result });
    try {
        const foundBet = await db.collection(collectionNames.bets).findOne({ betTx }) as Bet

        if (foundBet && foundBet.settleTx) {
            console.log(`skip`)
            return
        }

        const address = tronweb.address.fromHex(result.user)
        console.log({ address });

        const { type, modulo, value } = decodeBetData(result.data)

        const bet: Bet = {
            address,
            data: {
                type,
                modulo,
                value,
            },
            betTx,
            updatedAt: new Date(),
            createdAt: new Date()
        }

        const { insertedId } = await db.collection(collectionNames.bets).insertOne(bet)
        console.log({ insertedId });

        const user = await db.collection(collectionNames.users).findOneAndUpdate({ address }, {
            $set: {
                currentBet: insertedId,
                updatedAt: new Date()
            },
            $inc: {
                totalWager: value
            },
            $setOnInsert: {
                createdAt: new Date()
            }
        }, {
            returnOriginal: false,
            upsert: true
        })

        console.log({ user: user.value })

        const settleTx = await DiceContract.settle(address).send({ calValue: 0 })
        console.log({ settleTx });

        const updatedBet = await db.collection(collectionNames.bets).findOneAndUpdate({ _id: insertedId }, {
            $set: {
                settleTx,
                updatedAt: new Date()
            }
        }, { returnOriginal: false })

        console.log({ updatedBet: updatedBet.value });
    } catch (e) {
        throw e
    }
}

const processEventBetSettle = async (settleTx: string, _result: BetSettleEventResult) => {
    console.log({ processEventBetSettle: _result });
    try {
        const foundBet = await db.collection(collectionNames.bets).findOne({ settleTx }) as Bet

        if (foundBet && foundBet.result && foundBet.payout) {
            console.log(`skip`)
            return
        }

        const address = tronweb.address.fromHex(_result.user)
        const result = parseInt(_result.result)
        const payout = parseInt(_result.payout)
        console.log({ address, result, payout })

        const updatedBet = await db.collection(collectionNames.bets).findOneAndUpdate({ settleTx }, {
            $set: {
                result,
                payout,
                updatedAt: new Date()
            },
            $setOnInsert: {
                address,
                createdAt: new Date()
            }
        }, {
            returnOriginal: false,
            upsert: true
        })

        console.log({ updatedBet: updatedBet.value });

        const user = await db.collection(collectionNames.users).findOneAndUpdate({ address }, {
            $unset: {
                currentBet: '',
                updatedAt: new Date()
            }
        }, {
            returnOriginal: false,
            upsert: true
        })

        console.log({ user: user.value });
    } catch (e) {
        throw e
    }
}

const processEvent = async (event: any) => {
    try {
        switch (event.name) {
            case EventName.Bet:
                await processBetEvent(event.transaction, event.result)
                break;
            case EventName.BetSettle:
                await processEventBetSettle(event.transaction, event.result)
                break;
            default:
                break;
        }
    } catch (e) {
        throw e
    }
}

const getAllEvents = async (_fingerprint?: string, _events: any[] = []): Promise<any[]> => {
    try {
        const events: any[] = _fingerprint ? await tronweb.getEventResult(contract, { fingerprint: _fingerprint }) : await tronweb.getEventResult(contract)

        const fingerprint = events[events.length - 1]?.fingerprint

        return fingerprint ? getAllEvents(fingerprint, [..._events, ...events]) : [..._events, ...events]

    } catch (e) {
        throw e
    }
}

const syncEvents = async () => {
    const events = await getAllEvents()

    for (const event of events) {
        await processEvent(event)
    }

    DiceContract.Bet().watch(async (err, event) => {
        try {
            if (err) throw err

            if (!event) console.error(`event not found`)

            console.log({ event })

            await processEvent(event)
        } catch (e) {
            throw e
        }
    })

    DiceContract.BetSettle().watch(async (err, event) => {
        try {
            if (err) throw err

            if (!event) console.error(`event not found`)

            console.log({ event })

            await processEvent(event)
        } catch (e) {
            throw e
        }
    })
}



export { syncEvents }