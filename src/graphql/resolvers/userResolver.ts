import { compareData, hashData } from "@lib/hash";
import { GraphQLContext } from "@root/graphql/apollo";
import { UnauthenticationError } from "@root/lib/error";
import { randomUUID } from "crypto";
import { GraphQLError } from "graphql";

const userResolver = {
    Mutation: {
        async signUp(_: any, args: any, { fastify }: GraphQLContext) {
            const { username, password } = args.user;
            const user = await fastify.lowdb.find(user => user.username === username);

            if (user) {
                throw new GraphQLError(`user ${username} has existed`);
            }

            const hashedPassword = await hashData(password);

            const _user = await fastify.lowdb.create({
                username,
                password: hashedPassword,
                id: randomUUID()
            });

            delete _user.password;
            return _user;
        }
    },
    Query: {
        async get(_: any, __: any, { fastify, req }: GraphQLContext) {
            if (!req.user) {
                throw new UnauthenticationError("token invalid");
            }

            const { id, username } = req.user;
            const user = await fastify.lowdb.find(user => user.id === id);

            if (!user) {
                throw new GraphQLError(`user '${username}' does not existed`);
            }

            delete user.password;
            return user;
        },
        async login(_: any, args: any, { fastify, reply }: GraphQLContext) {
            const { username, password } = args.user;
            const user = await fastify.lowdb.find(user => user.username === username);

            if (!user) {
                throw new GraphQLError(`user '${username}' does not existed`);
            }

            const isMatch = await compareData(password, user.password);
            if (!isMatch) {
                throw new GraphQLError(`password does not matched`);
            }

            const tokens = fastify.token.signToken({ username, id: user.id, role: "" });

            delete user.password;
            return {
                token: {
                    ...tokens
                },
                user: {
                    ...user
                }
            }
        }
    }
}

export default userResolver;