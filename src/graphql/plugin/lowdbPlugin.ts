import { FastifyPluginCallback } from "fastify";
import FileSync from "lowdb/adapters/FileSync";
import low, { LowdbSync } from "lowdb";
import fp from "fastify-plugin";
import { User } from "@graphql/models";

export interface DbOptions {
    connectionString: string
}

export interface ILowdbMethod {
    create(user: User): Promise<User>;
    find(expression: (entity: User) => boolean): Promise<User | undefined>;
    client: LowdbSync<{ users: User[] }>
}

const result: FastifyPluginCallback<DbOptions> = fp((fastify, opts: DbOptions, done) => {
    const defaultData: { users: User[] } = { users: [] };
    const adapter = new FileSync<{ users: User[] }>(opts.connectionString);
    const db = low(adapter);

    db.defaults({ ...defaultData }).write();
    const _result = {
        async create(user: User): Promise<User> {
            db.get("users")
                .push({ ...user })
                .write();

            return user;
        },
        async find(expression: (entity: User) => boolean): Promise<User | undefined> {
            const entities = db.get("users");
            const index = entities.findIndex(expression).value();
            if (index === -1) {
                return undefined;
            }
            const result = entities.get(index).value();
            return { ...result };
        },
        client: db
    }
    fastify.decorate("lowdb", _result);

    done();
})


export default result;
