const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: "production",
    target: "node",
    entry: {
        app: "./src/functions/server.ts"
    },
    output: {
        filename: "server.js",
        path: path.join(__dirname, "dist/functions"),
        clean: true,
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.ts$/,
            use: ["ts-loader"]
        }]
    },
    devtool: "source-map",
    resolve: {
        symlinks: false,
        cacheWithContext: false,
        extensions: [".ts", ".js"],
        alias: {
            "@root": path.resolve(__dirname, "dist"),
            "@config": path.resolve(__dirname, "dist/config"),
            "@lib": path.resolve(__dirname, "dist/lib"),
            "@plugin": path.resolve(__dirname, "dist/plugin"),
            "@middleware": path.resolve(__dirname, "dist/middleware"),
            "@graphql": path.resolve(__dirname, "dist/graphql"),
            "@server": path.resolve(__dirname, "dist/server")
        },
        plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })]
    }
}