import fastify, { FastifyPluginCallback } from 'fastify';
import { IUserService } from "../services/userService";
import User, { schema } from '../models/user';
import { authenticationHook } from '@root/server/middleware/authMiddleware';
import { UnauthenticationError } from '@root/lib/error';

export interface UserRouter { }
const userRouter = (userService: IUserService) => {
    //TODO: validate req.body.username is email

    const _userRouter: FastifyPluginCallback<UserRouter> = (instance, opts, done) => {
        instance.get("/authorization", {
            preHandler: authenticationHook(instance.container)
        }, async (req, reply) => {
            // const secretWebhookKey = req.headers["x-hasura-secret-key"];
            // if (!secretWebhookKey) {
            //     throw new UnauthenticationError(`The ${secretWebhookKey} is required`);
            // }

            // if (secretWebhookKey !== "secret") {
            //     throw new UnauthenticationError(`The ${secretWebhookKey} is not correct`);
            // }

            reply.status(200).send({
                "X-Hasura-User-Id": req.user.id,
                "X-Hasura-Role": req.user.role,
                "Cache-Control": "max-age=600"
            });
        })

        instance.get("/", {
            preHandler: authenticationHook(instance.container)
        }, async (req, reply) => {
            const user = await userService.get(req.user);
            reply.send(user);
        })

        instance.post<{ Body: UserCreateDto }>("/signup", {
            // schema: {
            //     body: schema
            // }
        }, async (req, reply) => {
            const user = await userService.signUp(req.body);
            reply.send(user)
        })

        instance.post<{ Body: Omit<User, 'id'> }>("/login", {
            // schema: { body: schema }
        }, async (req, reply) => {
            const data = await userService.login(req.body);
            reply.send(data);
        })


        done();
    }

    return _userRouter;
}

export default userRouter;