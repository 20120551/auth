import { FastifyPluginAsync, FastifyPluginCallback } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";
import DomainError from "@lib/error";
import { serverDbOptions, tokenOptions } from "@config/config";
import createTokenGenerator, { TokenGenerator, TokenOptions } from "@lib/token";
import { DbConnection, DbOptions, createConnection } from "@server/models";
import { IUserRepository, userRepository } from "@server/repositories";
import { IUserService, userService } from "@server/services";
import { UserRouter, userRouter } from "@server/routes";
import createContainer from "@lib/container";

const swaggerOptions = {
    swagger: {
        info: {
            title: "My Title",
            description: "My Description.",
            version: "1.0.0",
        },
        host: "localhost",
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [{ name: "Default", description: "Default" }],
    },
};

const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
};

const serverBootstraping: FastifyPluginCallback = fp((fastify, _, done) => {
    // fastify.register(fastifySwagger, swaggerOptions);
    // fastify.register(fastifySwaggerUi, swaggerUiOptions);
    // register
    const container = createContainer();
    container.register<TokenGenerator>("tokenGenerator").to(createTokenGenerator);
    container.register<DbConnection>("dbConnection").to(createConnection);
    container.register<IUserRepository>("userRepository").to(userRepository);
    container.register<IUserService>("userService").to(userService);
    container.register<FastifyPluginCallback<UserRouter>>("userRouter").to(userRouter, { prefix: "/v1/auth" });
    container.bind<TokenOptions>("tokenOptions").to(tokenOptions);
    container.bind<DbOptions>("dbOptions").to(serverDbOptions);
    fastify.decorate("container", container);

    const controllers = container.getRoutes();
    controllers.forEach((_container) => {
        const { controller, prefix } = _container;
        fastify.register(controller, { prefix });
    })

    fastify.setErrorHandler((error, _, reply) => {
        if (error instanceof DomainError) {
            fastify.log.error(error.message);
            reply.status(error.code)
                .send({
                    statusCode: error.code,
                    message: error.message,
                    error: "Domain throw error"
                })
        } else {
            reply.send(error);
        }
    })

    done();
})

export default serverBootstraping;