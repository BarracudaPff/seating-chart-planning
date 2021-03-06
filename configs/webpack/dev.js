// development config
const {merge} = require("webpack-merge");
const commonConfig = require("./common");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(commonConfig, {
    mode: "development",
    entry: [
        "webpack-dev-server/client?http://localhost:8080", // bundle the client for webpack-dev-server and connect to the provided endpoint
        "./index.tsx", // the entry point of our app
    ],
    devServer: {
        hot: true, // enable HMR on the server
        historyApiFallback: true, // fixes error 404-ish errors when using react router :see this SO question: https://stackoverflow.com/questions/43209666/react-router-v4-cannot-get-url
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            plugins: [require.resolve('react-refresh/babel')].filter(Boolean),
                        },
                    },
                ],
            },
        ]
    },
    plugins: [new ReactRefreshWebpackPlugin()].filter(Boolean),
    devtool: "cheap-module-source-map",
});
