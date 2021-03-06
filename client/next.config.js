const withPWA = require("next-pwa");
const nextTranslate = require("next-translate");

module.exports = withPWA({
    webpackDevMiddleware: config => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        }
        return config
    },
    reactStrictMode: true,
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === 'development',
    },
    experimental: {
        outputStandalone: true,
    },
    ...nextTranslate(),
});
