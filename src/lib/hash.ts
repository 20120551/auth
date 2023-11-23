import { compare, hash, genSalt } from "bcryptjs";

export const hashData = async (data: string): Promise<string> => {
    const salt = await genSalt(10);
    const hashedData = await hash(data, salt);
    return hashedData;
    // return data;
}

export const compareData = async (data: string, hash: string): Promise<boolean> => {
    const isMatch = await compare(data, hash);
    return isMatch;
    // return true;
}