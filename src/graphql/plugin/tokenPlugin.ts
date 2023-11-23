import createTokenGenerator, { TokenOptions } from "@lib/token";
import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

const plugin: FastifyPluginCallback<TokenOptions> = fp((fastify, opts: TokenOptions, done) => {
    const result = createTokenGenerator(opts);
    fastify.decorate("token", result);
    done();
})

export default plugin;