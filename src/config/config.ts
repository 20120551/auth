import { TokenOptions } from "@lib/token"
import { DbOptions as GraphqlDbOptions } from "@graphql/plugin";
import { DbOptions as ServerDbOptions } from "@server/models";

import { FastifyListenOptions } from "fastify"

const config = {
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    GRAPHQL_CONNECTION_STRING: process.env.GRAPHQL_CONNECTION_STRING,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    HASURA_CLOUD_ENDPOINT: process.env.HASURA_CLOUD_ENDPOINT,
    HASURA_ADMIN_SECRET: process.env.HASURA_ADMIN_SECRET
}

export const serverDbOptions: ServerDbOptions = {
    connectionString: config.HASURA_CLOUD_ENDPOINT,
    adminSecret: config.HASURA_ADMIN_SECRET
}

export const graphqlDbOptions: GraphqlDbOptions = {
    connectionString: config.GRAPHQL_CONNECTION_STRING
}

export const tokenOptions: TokenOptions = {
    key: config.JWT_PRIVATE_KEY
}

export const fastifyServer: FastifyListenOptions = {
    port: parseInt(config.PORT),
    host: config.HOST
}