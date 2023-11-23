interface UserResponse {
    username: string,
    id?: string
}

interface UserCreateDto {
    username: string,
    password: string,
    role: string
}

interface UserReadDto {
    id: string,
    username: string,
    role: string
}

interface UserFindDto {
    username: string
}