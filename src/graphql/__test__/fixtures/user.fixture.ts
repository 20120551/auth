import { faker } from "@faker-js/faker";

export const CREATE_USER_DATA = {
    id: faker.string.sample(),
    username: faker.string.sample(),
    password: faker.string.sample(),
    role: faker.string.sample()
}