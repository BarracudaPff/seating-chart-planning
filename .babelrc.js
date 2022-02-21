module.exports = function babel(api) {
  const isProd = api.cache(() => process.env.NODE_ENV === "production");
  return {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: [
      isProd && "react-refresh/babel"
    ].filter(Boolean),
    env: {
      "production": {
        "presets": [
          "minify"
        ]
      }
    }
  }
}
