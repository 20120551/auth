import { GraphQLError } from "graphql";

// rest
export default class DomainError extends Error {
    public code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}

export class BadRequestError extends DomainError {

    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthenticationError extends DomainError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class ForBiddenError extends DomainError {
    constructor(message: string) {
        super(message, 403);
    }
}
// graph
// export class GraphqlDomainError extends GraphQLError {
//     constructor(message: string) {
//         const extensions =  {
//             code: ApolloServerErrorCode
//         }
//         super(message, this.extensions);
//     }
// }

// export class GraphqlBadRequestError extends GraphqlDomainError {
//     constructor(message: string, ) {
//         super();
        
//     }
// }