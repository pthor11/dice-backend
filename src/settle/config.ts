import { config } from "dotenv";

config()

if (!process.env.FULL_HOST) throw new Error(`full host must be provided`)
export const fullHost = process.env.FULL_HOST

if (!process.env.PRIVATEKEY) throw new Error(`private key must be provided`)
export const privateKey = process.env.PRIVATEKEY

if(!process.env.CONTRACT) throw new Error(`contract must be provided`)
export const contract = process.env.CONTRACT

if (!process.env.MONGO_URI) throw new Error(`mongo uri must be provided`)
export const mongoUri = process.env.MONGO_URI