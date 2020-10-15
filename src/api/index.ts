import { ApolloServer } from "apollo-server"
import { connectDb } from "./mongo"
import { typeDefs } from "./typeDefs/schema"
import { resolvers } from "./resolvers"
import { port } from "./config"
import { connectKafkaConsumer } from "./kafka";

const start = async () => {
    try {
        await connectDb()

        await connectKafkaConsumer()

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            subscriptions: { path: '/' }
        })

        const { url } = await server.listen({ port })

        console.log(`🚀 dice-api ready at ${url}`);

    } catch (e) {
        console.error(e)
    }
}

start()