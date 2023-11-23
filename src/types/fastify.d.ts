import { TokenGenerator, TokenPayload } from "@lib/token";
import { ILowdbMethod } from "@graphql/plugin";
import { Container } from "@lib/container";

declare module 'fastify' {
    interface FastifyInstance {
        token: TokenGenerator,
        lowdb: ILowdbMethod,
        container: Container,
        loadRoutes: () => void
    }

    interface FastifyRequest {
        token: string,
        user: TokenPayload
    }
}
