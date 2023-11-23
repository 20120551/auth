import fastifyApollo from "@as-integrations/fastify";
import { FastifyPluginAsync, FastifyPluginCallback } from "fastify"
import apollo from "../apollo";

const result: FastifyPluginAsync = async (fastify, _) => {
    await apollo.start();
    await fastify.register(fastifyApollo(apollo), {
        context: async (req, reply) => {
            try {
                let token = req.headers["authorization"];
                if (token) {
                    //handle
                    token = token.replace("Bearer ", "");
                    const payload = fastify.token.verifyToken(token);
                    req.user = payload;
                    req.token = token;
                }
                return {
                    req,
                    fastify,
                    reply
                }
            } catch (err) {
                console.log(err.message);
                reply.status(200).send({
                    errors: [{
                        message: err.message,
                        extensions: {
                            code: "UNAUTHENTICATION"
                        }
                    }]
                });
            }
        }
    });
}


export default result;
