import { ApolloServer } from "apollo-server"
import { connectDb } from "./mongo"
import { typeDefs } from "./typeDefs/schema"
import { resolvers } from "./resolvers"
import { port } from "./config"

const start = async () => {
    try {
        await connectDb()

        const server = new ApolloServer({
            typeDefs,
            resolvers
        })

        const { url } = await server.listen({ port })

        console.log(`🚀 dice-api ready at ${url}`);

    } catch (e) {
        console.error(e)
    }
}

start()