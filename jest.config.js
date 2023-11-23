const { compilerOptions } = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest");

module.exports = {
    preset: "ts-jest",
    moduleDirectories: ["node_modules", "<rootDir>/src"],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    testTimeout: 10000,
    setupFiles: ["dotenv/config"],
};