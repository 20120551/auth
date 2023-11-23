import Fastify, { FastifyInstance } from "fastify"
import { LowdbSync } from "lowdb";
import { CREATE_USER_DATA } from "./fixtures/user.fixture";
import { User } from "@graphql/models";
import { lowdbPlugin } from "@graphql/plugin";

// test / resolver
describe("[TEST] Testing LowDb Plugin", () => {
    let fastify: FastifyInstance;
    let db: LowdbSync<{ users: User[] }>;
    beforeAll(async () => {
        fastify = Fastify();
        fastify.register(lowdbPlugin, { connectionString: "src/graphql/__test__/data/fakeDb.json" });
        await fastify.ready();
        db = fastify.lowdb.client;
    });

    afterEach(() => {
        db.setState({ users: [] }).write();
    })

    afterAll(() => {
        fastify.close();
    });

    describe("[TEST] Testing lowdb find method", () => {
        test("[FUNCTION] Testing find function while input does not found on database result in undefined", async () => {
            // arrange
            // act
            const result = await fastify.lowdb.find(user => user.username === CREATE_USER_DATA.username);

            // assert
            expect(result).toBeUndefined();
        })

        test("[FUNCTION] Testing find function while input matched on database result in user data", async () => {
            // arrange
            db.get("users").push(CREATE_USER_DATA).write();
            // act
            const result = await fastify.lowdb.find(user => user.username === CREATE_USER_DATA.username);

            // assert
            expect(result).toBeTruthy();
            expect(result.id).toEqual(CREATE_USER_DATA.id);
        })
    });

    describe("[TEST] Testing lowdb create method", () => {
        test("[FUNCTION] Testing create function return new user data", async () => {
            // arrange
            jest.spyOn(db, 'write')
                .mockImplementation(() => Promise.resolve());
            // act
            const result = await fastify.lowdb.create(CREATE_USER_DATA);
            // assert
            expect(db.write).toHaveBeenCalled();
            expect(result).toBeTruthy();
            expect(result.id).toBe(CREATE_USER_DATA.id);
        })
    })
})