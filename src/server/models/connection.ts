import axios, { AxiosInstance } from "axios";
import User from "./user";

export interface DbOptions {
    readonly connectionString: string
    readonly adminSecret: string
}

export interface DbConnection {
    db: AxiosInstance
}

const createConnection = (dbOptions: DbOptions): DbConnection => {
    // const defaultData: { users: User[] } = { users: [] };
    // const adapter = new FileSync<{ users: User[] }>(dbOptions.connectionString);
    // const db = low(adapter);

    // db.defaults({ ...defaultData }).write();

    const axiosInstance = axios.create({
        baseURL: dbOptions.connectionString, headers: {
            "x-hasura-admin-secret": dbOptions.adminSecret
        }
    });
    return {
        db: axiosInstance
    }
}

export default createConnection;