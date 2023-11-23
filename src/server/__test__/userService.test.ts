import { CREATE_USER_DATA } from "./fixtures/user.fixture";
import { BadRequestError } from "@lib/error";
import { TokenGenerator } from "@lib/token";
import { IUserRepository } from "@server/repositories";
import { IUserService, userService } from "@server/services";

describe("[TEST] UserService functionalities", () => {
    let _userService: IUserService;
    let _userRepo: IUserRepository;
    let _tokenGenerator: TokenGenerator;

    beforeAll(() => {
        _userRepo = {
            find: jest.fn((user) => Promise.resolve(user)),
            create: jest.fn((user) => Promise.resolve(user))
        }

        _tokenGenerator = {
            signToken: jest.fn(() => ({
                accessToken: "",
                refreshToken: ""
            })),
            verifyToken: jest.fn(() => (null))
        };
    })
    describe("[TEST GET] Testing get user function", () => {
        test("[FUNCTION] Testing get user function while user does not exist result in throw error", async () => {
            // arrange
            jest.spyOn(_userRepo, 'find')
                .mockImplementation(() => Promise.resolve(undefined));
            _userService = userService(_userRepo, _tokenGenerator);

            // act & assert
            await expect(_userService.get({ username: CREATE_USER_DATA.username })).rejects
                .toThrowError(BadRequestError);
        })

        test("[FUNCTION] Testing get user function while user has existed result in throw error", async () => {
            // arrange
            jest.spyOn(_userRepo, 'find')
                .mockImplementation(() => Promise.resolve({ ...CREATE_USER_DATA }));
            _userService = userService(_userRepo, _tokenGenerator);

            // act
            const user = await _userService.get({ username: CREATE_USER_DATA.username });

            // assert
            expect(user).toBeTruthy();
            expect(user.user.username).toEqual(CREATE_USER_DATA.username);
        })
    })
    describe("[TEST SIGNUP] Testing signup function", () => {
        test("[FUNCTION] testing sign up function while user input has existed result in throw error", async () => {
            // arrange
            jest.spyOn(_userRepo, 'find')
                .mockImplementation(jest.fn(() => Promise.resolve({ ...CREATE_USER_DATA })));
            _userService = userService(_userRepo, _tokenGenerator);

            // act & assert
            await expect(_userService.signUp(CREATE_USER_DATA)).rejects
                .toThrowError(BadRequestError);
        })
        test("[FUNCTION] testing sign up function while user input does not exist result in successful case", async () => {
            // arrange
            jest.spyOn(_userRepo, 'find')
                .mockImplementation(() => Promise.resolve(undefined));
            jest.spyOn(_userRepo, 'create')
                .mockImplementation(() => Promise.resolve(CREATE_USER_DATA));

            _userService = userService(_userRepo, _tokenGenerator);

            // act
            const user = await _userService.signUp(CREATE_USER_DATA);

            // assert
            expect(_userRepo.create).toHaveBeenCalled();
            expect(user).toBeTruthy();
            expect(user.user.username).toEqual(CREATE_USER_DATA.username);
        })
    })

    describe("[TEST LOGIN] Testing login function", () => {
        test("[FUNCTION] Testing login function while user does not exist result in throw error", async () => {
            // arrange
            jest.spyOn(_userRepo, 'find')
                .mockImplementation(() => Promise.resolve(undefined));
            _userService = userService(_userRepo, _tokenGenerator);

            // act & assert
            await expect(_userService.login(CREATE_USER_DATA)).rejects
                .toThrowError(BadRequestError);
        })

        test("[FUNCTION] Testing login function while user has existed but password does not match result in throw error", async () => {
            // arrange
            jest.spyOn(_userRepo, 'find')
                .mockImplementation(() => Promise.resolve(CREATE_USER_DATA));
            jest.spyOn(await import('@lib/hash'), 'compareData')
                .mockImplementation(() => Promise.resolve(false));
            _userService = userService(_userRepo, _tokenGenerator);

            // act & assert
            await expect(_userService.login(CREATE_USER_DATA)).rejects
                .toThrowError(BadRequestError)
        })

        test("[FUNCTION] Testing login function while username and password are correct result in successful case", async () => {
            // arrange
            jest.spyOn(_userRepo, 'find')
                .mockImplementation(() => Promise.resolve(CREATE_USER_DATA));
            jest.spyOn(await import('@lib/hash'), 'compareData')
                .mockImplementation(() => Promise.resolve(true));

            _userService = userService(_userRepo, _tokenGenerator);

            // act
            const user = await _userService.login(CREATE_USER_DATA);

            // assert
            expect(_tokenGenerator.signToken).toHaveBeenCalled();
            expect(user).toBeTruthy();
            expect(user.user.username).toEqual(CREATE_USER_DATA.username);
        })
    })
})