import { Type, Static, Optional } from '@sinclair/typebox';


export const schema = Type.Object({
    id: Type.String(),
    username: Type.String(),
    password: Type.String(),
    role: Type.Optional(Type.String())
})

type User = Static<typeof schema>;
export default User;