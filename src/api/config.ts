import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

const path = join(__dirname, `../../.api.env`)

if (existsSync(path)) {
    config({ path })
} else {
    config()
}

if (!process.env.PORT) throw new Error(`port must be provided`)
export const port = process.env.PORT

if (!process.env.MONGO_URI) throw new Error(`mongo uri must be provided`)
export const mongoUri = process.env.MONGO_URI