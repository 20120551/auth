// import bootstrap from "@root/index";
import Fastify, { FastifyInstance } from "fastify";
import { CREATE_USER_DATA } from "./fixtures/user.fixture";
import { apolloPlugin } from "../plugin";
import _fastify from "@root/bootstrap";

describe("[TEST] Testing userResolver functionalities", () => {
    let fastify: FastifyInstance;
    beforeAll(async () => {
        fastify = _fastify;
        await fastify.ready();
    });

    afterAll(() => {
        fastify.close();
    });

    describe("[TEST] /graphql signUp", () => {
        const signUpMutation = `
                mutation SignUp($user: UserInput) {
                    signUp(user: $user) {
                        id,
                        username
                    }
                }
            `
        const userInput = {
            user: {
                username: CREATE_USER_DATA.username,
                password: CREATE_USER_DATA.password
            }
        }

        test("[FUNCTION] Testing signup while username has existed on database", async () => {
            // arrange
            jest.spyOn(fastify.lowdb, 'find')
                .mockImplementation(() => Promise.resolve({ ...CREATE_USER_DATA }));
            // act
            const response = await fastify.inject({
                method: "POST",
                url: "/graphql",
                body: {
                    query: signUpMutation,
                    variables: {
                        ...userInput
                    }
                }
            })

            // assert
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.data.signUp).toBeNull();
            expect(json.errors).toBeTruthy();
        })

        test("[FUNCTION] Testing signup while username does not exist on database", async () => {
            // arrange
            jest.spyOn(fastify.lowdb, 'find')
                .mockImplementation(() => Promise.resolve(undefined));
            jest.spyOn(fastify.lowdb, 'create')
                .mockImplementation(() => Promise.resolve({ ...CREATE_USER_DATA }))

            // act
            const response = await fastify.inject({
                method: 'POST',
                url: "/graphql",
                body: {
                    query: signUpMutation,
                    variables: {
                        ...userInput
                    }
                }
            });

            // assert
            expect(fastify.lowdb.create).toHaveBeenCalled();
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.data.signUp).toBeTruthy();
            expect(json.data.signUp.username).toBe(CREATE_USER_DATA.username);
        })
    })

    describe("[TEST] /graphql login", () => {
        const loginQuery = `
            query Login($user: UserInput) {
                login(user: $user) {
                    user {
                        username
                    }
                    token {
                        accessToken
                    }
                }
            }`
        const userInput = {
            user: {
                username: CREATE_USER_DATA.username,
                password: CREATE_USER_DATA.password
            }
        }

        test("[FUNCTION] Testing login while user does not exist on database", async () => {
            jest.spyOn(fastify.lowdb, 'find')
                .mockImplementation(() => Promise.resolve(undefined));
            // act
            const response = await fastify.inject({
                method: "POST",
                url: "/graphql",
                body: {
                    query: loginQuery,
                    variables: {
                        ...userInput
                    }
                }
            })

            // assert
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.data.login).toBeNull();
            expect(json.errors).toBeTruthy();
        })

        test("[FUNCTION] Testing login while user has existed on database but password does not match", async () => {
            jest.spyOn(fastify.lowdb, 'find')
                .mockImplementation(() => Promise.resolve({ ...CREATE_USER_DATA }));
            jest.spyOn(await import("@lib/hash"), 'compareData')
                .mockResolvedValue(false);

            // act
            const response = await fastify.inject({
                method: "POST",
                url: "/graphql",
                body: {
                    query: loginQuery,
                    variables: {
                        ...userInput
                    }
                }
            })

            // assert
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.data.login).toBeNull();
            expect(json.errors).toBeTruthy();
        })

        test("[FUNCTION] Testing login while user has existed on database and password is matched", async () => {
            jest.spyOn(fastify.lowdb, 'find')
                .mockImplementation(() => Promise.resolve({ ...CREATE_USER_DATA }));
            jest.spyOn(await import("@lib/hash"), 'compareData')
                .mockResolvedValue(true);
            jest.spyOn(fastify.token, 'signToken')
                .mockReturnValue({ accessToken: "", refreshToken: "" })

            // act
            const response = await fastify.inject({
                method: "POST",
                url: "/graphql",
                body: {
                    query: loginQuery,
                    variables: {
                        ...userInput
                    }
                }
            })

            // assert
            expect(fastify.token.signToken).toHaveBeenCalled();
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.data.login).toBeTruthy();
            expect(json.data.login.user.username).toEqual(CREATE_USER_DATA.username);
        })
    })

    describe("[TEST] /graphql get", () => {
        const getUserQuery = `
            query Get {
                get {
                    id,
                    username
                }
            }`
        const token = "Bearer token";

        test("[FUNCTION] Testing get user while empty header authorization", async () => {
            // arrange
            // act
            const response = await fastify.inject({
                method: "POST",
                url: "/graphql",
                body: {
                    query: getUserQuery,
                }
            });

            // assert
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.errors).toBeTruthy();
        })

        // this error cause by token.verify(token), so it does not be handled on user resolver 
        test("[FUNCTION] Testing get user while invalid token", async () => {
            // arrange
            // act
            const response = await fastify.inject({
                method: "POST",
                body: {
                    query: getUserQuery,
                },
                url: "/graphql",
                headers: {
                    authorization: token
                }
            });

            // assert
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.errors).toBeTruthy();
        })

        test("[FUNCTION] Testing get user while user id attach on token does not appear on database", async () => {
            // arrange
            jest.spyOn(fastify.token, 'verifyToken')
                .mockReturnValue({ ...CREATE_USER_DATA });
            jest.spyOn(fastify.lowdb, 'find')
                .mockReturnValue(Promise.resolve(undefined));
            // act
            const response = await fastify.inject({
                method: "POST",
                body: {
                    query: getUserQuery,
                },
                url: "/graphql",
                headers: {
                    authorization: token
                }
            });

            // assert
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.errors).toBeTruthy();
        })

        test("[FUNCTION] Testing get user while user id attach on token does not appear on database", async () => {
            // arrange
            jest.spyOn(fastify.token, 'verifyToken')
                .mockReturnValue({ ...CREATE_USER_DATA });
            jest.spyOn(fastify.lowdb, 'find')
                .mockReturnValue(Promise.resolve({ ...CREATE_USER_DATA }));
            // act
            const response = await fastify.inject({
                method: "POST",
                body: {
                    query: getUserQuery,
                },
                url: "/graphql",
                headers: {
                    authorization: token
                }
            });

            // assert
            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.data.get).toBeTruthy();
            expect(json.data.get.username).toEqual(CREATE_USER_DATA.username);
        })
    })
});