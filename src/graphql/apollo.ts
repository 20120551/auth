import { ApolloServer, BaseContext } from "@apollo/server";
import fastifyApollo from "@as-integrations/fastify";
import { FastifyInstance, FastifyRequest } from "fastify";
import { FastifyReply } from "fastify/types/reply";
import { userResolver } from "./resolvers";
import { userTypeDefs } from "./typedefs";

export interface GraphQLContext extends BaseContext {
    req: FastifyRequest,
    fastify: FastifyInstance,
    reply: FastifyReply
}

const apollo = new ApolloServer<GraphQLContext>({
    typeDefs: userTypeDefs,
    resolvers: userResolver,
    status400ForVariableCoercionErrors: true,
});

export default apollo;

