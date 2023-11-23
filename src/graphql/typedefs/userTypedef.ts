export const userTypeDefs = `#graphql
    type User {
        id: String
        username: String
        password: String
    }

    input UserInput {
        username: String
        password: String
    }

    type UserReadDto {
        id: String
        username: String
    }

    type TokenReadDto {
        refreshToken: String
        accessToken: String
    }

    type UserLoginDto {
        user: UserReadDto
        token: TokenReadDto
    }

    type Mutation {
        signUp(user: UserInput): UserReadDto
    }

    type Query {
        get: UserReadDto
        login(user: UserInput): UserLoginDto
    }
`