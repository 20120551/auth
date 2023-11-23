import { DbConnection, createConnection } from '@server/models';
import { IUserRepository, userRepository } from '@server/repositories';
import { CREATE_USER_DATA } from './fixtures/user.fixture';

describe("[TEST] UserRepository functionalities", () => {
    let userRepoMock: IUserRepository = null;
    let dbConnection: DbConnection = null;
    beforeEach(() => {
        dbConnection = createConnection({
            connectionString: "",
            adminSecret: ''
        });
    });

    test("[FUNCTION] Testing create function result in successful case", async () => {
        // arrange
        jest.spyOn(dbConnection.db, 'post')
            .mockReturnValue(Promise.resolve({
                data: {
                    data:
                    {
                        insert_user: {
                            returning: [CREATE_USER_DATA]
                        }
                    }
                }
            }));

        userRepoMock = userRepository(dbConnection);
        // act
        const user = await userRepoMock.create(CREATE_USER_DATA);

        // assert
        expect(dbConnection.db.post).toHaveBeenCalled();
        expect(user).toBeTruthy();
        expect(user.username).toEqual(CREATE_USER_DATA.username);
    })

    test("[FUNCTION] Testing find function while user does not found on database result in undefined result", async () => {
        jest.spyOn(dbConnection.db, 'post')
            .mockImplementation(() => Promise.resolve({
                data: {
                    data: {
                        user: []
                    }
                }
            }))
        // arrange
        userRepoMock = userRepository(dbConnection);
        // act
        const user = await userRepoMock.find(CREATE_USER_DATA);
        // arrange
        expect(user).toBeUndefined();
    })

    test("[FUNCTION] testing find function while user has exist on database result in successful case", async () => {
        // arrange
        jest.spyOn(dbConnection.db, 'post')
            .mockImplementation(() => Promise.resolve({
                data: {
                    data: {
                        user: [CREATE_USER_DATA]
                    }
                }
            }));
        userRepoMock = userRepository(dbConnection);

        // act
        const user = await userRepoMock.find(CREATE_USER_DATA);

        // arrange
        expect(dbConnection.db.post).toHaveBeenCalled();
        expect(user).toBeTruthy();
        expect(user.username).toEqual(CREATE_USER_DATA.username);
    })
})