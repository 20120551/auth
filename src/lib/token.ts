import jwt, { JwtPayload, decode } from "jsonwebtoken";
import { UnauthenticationError } from "./error";

const { sign, verify } = jwt;
export type TokenOptions = {
    key: string
}

export type TokenPayload = {
    username: string,
    id: string,
    role: string,
}

export type TokenGeneration = {
    refreshToken: string,
    accessToken: string,
}

export type TokenGenerator = {
    signToken: (payload: TokenPayload) => TokenGeneration,
    verifyToken: (token: string) => TokenPayload
}

const createTokenGenerator = (tokenOptions: TokenOptions): TokenGenerator => {
    const result = {
        signToken(payload: TokenPayload): TokenGeneration {
            const accessToken = sign(payload, tokenOptions.key, { expiresIn: '10m' });
            const refreshToken = sign(payload, tokenOptions.key, { expiresIn: '1d' });

            const result = {
                accessToken,
                refreshToken
            }
            return result;
        },

        verifyToken(token: string): TokenPayload {
            // check expiration date
            try {
                const time = Date.now();
                const { exp } = decode(token) as {
                    exp: number
                };

                if (exp * 1000 < time) {
                    throw new UnauthenticationError('token expiration');
                }

                const payload = verify(token, tokenOptions.key) as JwtPayload;
                //TODO: fixed return tokenpayload
                const result = {
                    username: payload.username,
                    id: payload.id,
                    role: payload.role
                }
                return result;
            }
            catch (err) {
                throw new UnauthenticationError("cannot verify token because token invalid");
            }
        }
    }

    return result;
}

export default createTokenGenerator;