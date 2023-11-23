import { CREATE_USER_DATA } from "./fixtures/user.fixture";
import { BadRequestError, UnauthenticationError } from "@lib/error";
import { TokenGenerator } from "@root/lib/token";
import { FastifyInstance } from 'fastify'
import { IUserService } from "@server/services";
import fastify from "@root/bootstrap";

describe("[TEST] UserRouter functionalities", () => {
    let _userService: IUserService;
    let _tokenGeneration: TokenGenerator;
    let server: FastifyInstance;

    beforeAll(async () => {
        server = fastify;
        await server.ready();

        _userService = server.container.resolve<IUserService>("userService");
        _tokenGeneration = server.container.resolve<TokenGenerator>("tokenGenerator");
    })

    afterAll(() => {
        server.close();
    })

    describe("[TEST] /v1/auth", () => {
        test("[FUNCTION] Testing GET /v1/auth endpoint with empty authorization header result in unauthentication response", async () => {
            // arrange
            // act and assert
            const response = await server.inject({
                method: "GET",
                url: "/v1/auth"
            });

            expect(response.statusCode).toBe(401);
            const json = response.json();
            expect(json.error).toBeTruthy();
        })

        test("[FUNCTION] Testing GET /v1/auth endpoint with token expiration result in unauthentication response", async () => {
            // arrange
            jest.spyOn(_tokenGeneration, 'verifyToken')
                .mockImplementation(() => {
                    throw new UnauthenticationError("");
                })
            // act and assert
            const response = await server.inject({
                method: "GET",
                url: "/v1/auth",
                headers: {
                    authorization: "Bearer token"
                }
            });

            expect(response.statusCode).toBe(401);
            const json = response.json();
            expect(json.error).toBeTruthy();
        })

        test("[FUNCTION] Testing GET /v1/auth endpoint while verify token success but username does not found result in bad request response", async () => {
            // arrange
            jest.spyOn(_tokenGeneration, 'verifyToken')
                .mockImplementation(() => ({
                    username: CREATE_USER_DATA.username,
                    id: "",
                    role: ""
                }))

            jest.spyOn(_userService, 'get')
                .mockImplementation(() => Promise.reject(new BadRequestError("")))

            // act and assert
            const response = await server.inject({
                method: "GET",
                url: "/v1/auth",
                headers: {
                    authorization: "Bearer token"
                }
            });

            expect(response.statusCode).toBe(400);
            const json = response.json();
            expect(json.error).toBeTruthy();
        })

        test("[FUNCTION] Testing GET /v1/auth endpoint while verify token success result in unauthentication response", async () => {
            // arrange
            jest.spyOn(_tokenGeneration, 'verifyToken')
                .mockImplementation(() => ({
                    username: CREATE_USER_DATA.username,
                    id: "",
                    role: ""
                }))

            jest.spyOn(_userService, 'get')
                .mockImplementation(() => Promise.resolve({ user: CREATE_USER_DATA }))

            // act and assert
            const response = await server.inject({
                method: "GET",
                url: "/v1/auth",
                headers: {
                    authorization: "Bearer token"
                }
            });

            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json.user).toBeTruthy();
            expect(json.user.username).toEqual(CREATE_USER_DATA.username);
        })
    })
    describe("[TEST] /v1/auth/signup", () => {
        test("[FUNCTION] Testing POST /v1/auth/signup endpoint with user input has existed result in bad request response", async () => {
            // arrange
            jest.spyOn(_userService, 'signUp')
                .mockImplementation(() => Promise.reject(new BadRequestError("something bad")));
            // act and assert
            const response = await server.inject({
                method: "POST",
                url: "/v1/auth/signup",
                payload: CREATE_USER_DATA
            })

            expect(response.statusCode).toBe(400);
            const json = response.json();
            expect(json.error).toBeTruthy();
        })

        test("[FUNCTION] Testing POST /v1/auth/signup endpoint with user input does not exist result in ok response", async () => {
            // arrange
            jest.spyOn(_userService, 'signUp')
                .mockImplementation(() => Promise.resolve({ user: CREATE_USER_DATA }));
            // act and assert
            const response = await server.inject({
                method: "POST",
                url: "/v1/auth/signup",
                payload: CREATE_USER_DATA
            })

            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json).toBeTruthy();
            expect(json.user.username).toEqual(CREATE_USER_DATA.username);
        })
    })

    describe("[TEST] /v1/auth/login", () => {
        test("[FUNCTION] Testing POST /v1/auth/login endpoint with user input has existed result in bad request response", async () => {
            // arrange
            jest.spyOn(_userService, 'login')
                .mockImplementation(() => Promise.reject(new BadRequestError("something bad")));
            // act and assert
            const response = await server.inject({
                method: "POST",
                url: "/v1/auth/login",
                payload: CREATE_USER_DATA
            })

            expect(response.statusCode).toBe(400);
            const json = response.json();
            expect(json.error).toBeTruthy();
        })

        test("[FUNCTION] Testing POST /v1/auth/login endpoint with user input does not exist result in ok response", async () => {
            // arrange
            jest.spyOn(_userService, 'login')
                .mockImplementation(() => Promise.resolve({
                    user: {
                        username: CREATE_USER_DATA.username,
                    },
                    token: {
                        accessToken: "",
                        refreshToken: ""
                    }
                }));
            // act and assert
            const response = await server.inject({
                method: "POST",
                url: "/v1/auth/login",
                payload: CREATE_USER_DATA
            })

            expect(response.statusCode).toBe(200);
            const json = response.json();
            expect(json).toBeTruthy();
            expect(json.user.username).toEqual(CREATE_USER_DATA.username);
        })
    })
});