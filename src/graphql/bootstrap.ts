import { FastifyPluginAsync, FastifyPluginCallback } from "fastify";
import { apolloPlugin, lowdbPlugin, tokenGeneratorPlugin } from "./plugin";
import { graphqlDbOptions, tokenOptions } from "@config/config";
import fp from "fastify-plugin";

const graphqlBootstraping: FastifyPluginCallback = fp((fastify, _, done) => {
    fastify.register(apolloPlugin);
    fastify.register(lowdbPlugin, { ...graphqlDbOptions });
    fastify.register(tokenGeneratorPlugin, { ...tokenOptions });

    done();
})

export default graphqlBootstraping;