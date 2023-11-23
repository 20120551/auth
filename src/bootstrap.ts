import cors from "@fastify/cors";
import Fastify, { FastifyPluginCallback } from "fastify";
import serverBootstraping from "@server/bootstrap";
import graphqlBootstraping from "@graphql/bootstrap";

const fastify = Fastify({ logger: true });
fastify.register(cors, {
    origin: true
});

fastify.get("/", (_, reply) => reply.send("test"));
// fastify.register(graphqlBootstraping);
fastify.register(serverBootstraping);


export default fastify;