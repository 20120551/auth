import User from "../models/user";
import { DbConnection } from "../models/connection";
import { randomUUID } from "crypto";
import gql from "graphql-tag";

export interface IUserRepository {
    create({ username, password, role }: User): Promise<User>;
    find({ username }: User): Promise<User | undefined>;
}

const userRepository = (dbConnection: DbConnection): IUserRepository => {
    const axios = dbConnection.db;
    const result = {
        async create({ username, password, role }: User): Promise<User> {
            const user = { username, password, role, id: randomUUID() };

            const mutation = `#graphql
                mutation MyMutation($objects: [user_insert_input!] = {}) {
                    insert_user(objects: $objects) {
                        returning {
                            id
                            username
                            role
                        }
                    }
                }
            `

            const response = await axios.post("/", {
                query: mutation,
                variables: {
                    objects: user
                }
            }, {
                headers: {
                    "x-hasura-role": "anonymous"
                }
            });

            if (response.data?.errors) {
                throw new Error(response.data.errors[0]);
            }

            const { returning } = response.data.data.insert_user;

            return returning[0];
        },
        async find({ username }: User): Promise<User | undefined> {
            const query = `#graphql
                query MyQuery {
                    user {
                        id
                        password
                        username
                        role
                    }
                }
            `

            const response = await axios.post("/", {
                query,
            }, {
                headers: {
                    "x-hasura-role": "anonymous",
                    "X-Hasura-Username": username
                }
            });

            if (response.data?.errors) {
                throw new Error(response.data.errors[0]);
            }

            const { user } = response.data.data;
            if (user.length === 0) {
                return undefined;
            }

            return user[0];
        }
    }

    return result;
}

export default userRepository;