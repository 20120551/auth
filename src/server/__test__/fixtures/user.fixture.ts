import { faker } from "@faker-js/faker";

export const CREATE_USER_DATA = {
    username: faker.string.sample(),
    password: faker.string.sample(),
    id: faker.string.sample(),
    role: faker.string.sample()
}