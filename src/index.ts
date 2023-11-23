// import "module-alias/register";
import 'dotenv/config';
import fastify from "./bootstrap";
import { fastifyServer } from "./config/config";

const bootstrap = async () => {
    await fastify.listen({ ...fastifyServer });
    return fastify;
}

bootstrap();

export default bootstrap;