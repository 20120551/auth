import { Container } from "@root/lib/container";
import { UnauthenticationError } from "@root/lib/error";
import { TokenGenerator } from "@root/lib/token";
import { FastifyReply, FastifyRequest } from "fastify";

// version 1 (for container registration)
const authenticationHook = (container: Container) => {
    const authentication = async (req: FastifyRequest, reply: FastifyReply, done: any) => {
        let token = req.headers["authorization"];
        if (!token) {
            throw new UnauthenticationError("token was not appear on request header");
        }

        token = token.replace("Bearer ", "");
        const tokenGenerator = container.resolve<TokenGenerator>("tokenGenerator");
        const payload = tokenGenerator.verifyToken(token);
        req.user = payload;
        req.token = token;

        // done();
    }
    return authentication;
}

const authorization = async (req: FastifyRequest, reply: FastifyReply, done: any) => {
    // authentication(req, reply, done);
    // TODO: handle authorization
}

export {
    authenticationHook,
    authorization
}