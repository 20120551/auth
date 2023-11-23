export function getArgumentNames(func: (...args: any[]) => void): string[] {
    const funcString = func.toString();
    const argNames = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')')).match(/([^\s,]+)/g);
    return argNames || [];
}

export function getArgumentType(func: (...args: any[]) => any): string[] {
    const funcString = func.toString();
    const args = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')'));

    const result = []
    const pattern = /(\w+):\s+(\w+)/g;
    let match;
    while ((match = pattern.exec(args)) !== null) {
        const argType = match[2];
        result.push(argType);
    }


    return result;
}