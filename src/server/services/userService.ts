import { BadRequestError } from "@lib/error"
import { compareData, hashData } from "@lib/hash";
import { TokenGeneration, TokenGenerator } from "@lib/token";
import User from "../models/user";
import { IUserRepository } from "../repositories/userRepository";

export interface IUserService {
    get({ username }: UserFindDto): Promise<{ user: UserResponse }>;
    signUp({ username, password, role }: UserCreateDto): Promise<{ user: UserResponse }>;
    login({ username, password }: Omit<User, 'id'>): Promise<{
        user: UserResponse
        token: TokenGeneration
    }>
}

const userService = (userRepository: IUserRepository, tokenGenerator: TokenGenerator): IUserService => {
    const result = {
        async get({ username }: UserFindDto): Promise<{ user: UserResponse }> {
            const userDto: User = { id: "", username, password: "" }
            const user = await userRepository.find(userDto);
            if (!user) {
                throw new BadRequestError(`user '${username}' does not existed`);
            }

            delete user.password;
            return { user };
        },
        async signUp({ username, password, role }: UserCreateDto): Promise<{ user: UserResponse }> {
            const userDto: User = { id: "", username, password, role: "user" }
            console.log(userDto);
            const user = await userRepository.find(userDto);

            if (user) {
                throw new BadRequestError(`user ${username} has existed`);
            }

            const hashedPassword = await hashData(password);
            const _user = await userRepository.create({
                ...userDto,
                password: hashedPassword
            });

            delete _user.password;
            return { user: _user };
        },
        async login({ username, password }: Omit<User, 'id'>): Promise<{
            user: UserResponse,
            token: TokenGeneration
        }> {
            const userDto: User = { id: "", username, password }
            const user = await userRepository.find(userDto);

            if (!user) {
                throw new BadRequestError(`user '${username}' does not existed`);
            }

            const isMatch = await compareData(password, user.password);
            if (!isMatch) {
                throw new BadRequestError(`password does not matched`);
            }

            const tokens = tokenGenerator.signToken({ username, id: user.id, role: user.role });

            delete user.password;
            return {
                user,
                token: tokens
            }
        }
    }

    return result;
}

export default userService;