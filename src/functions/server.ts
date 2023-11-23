// import "module-alias/register";
import awsLambdaFastify from "@fastify/aws-lambda";
import fastify from "../bootstrap";

const proxy = awsLambdaFastify(fastify as any);

export const handler = async (event: any, context: any) => {
    const res = await proxy(event, context);
    console.log(res);
    return res;
}