const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: "production",
    target: "node",
    entry: {
        app: "./src/index.ts"
    },
    output: {
        filename: "index.js",
        path: path.join(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.ts$/,
            use: ["ts-loader"]
        }]
    },
    devtool: "source-map",
    // devServer: {
    //     server: "http",
    //     static: {
    //         directory: path.join(__dirname, "dist"),
    //     },
    //     compress: true,
    //     port: 3000
    // },
    resolve: {
        extensions: [".ts", ".js"],
        // alias: {
        //     "@root": path.resolve(__dirname, "src"),
        //     "@config": path.resolve(__dirname, "src/config"),
        //     "@lib": path.resolve(__dirname, "src/lib"),
        //     "@plugin": path.resolve(__dirname, "src/plugin"),
        //     "@middleware": path.resolve(__dirname, "src/middleware"),
        //     "@graphql": path.resolve(__dirname, "src/graphql"),
        //     "@server": path.resolve(__dirname, "src/server")
        // },
        plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })]
    }
}