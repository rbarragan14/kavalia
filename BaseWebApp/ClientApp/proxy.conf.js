const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/.well-known",
            "/connect"
        ],
        target: "http://localhost:23354",
        secure: false,
        logLevel: "debug",
        changeOrigin: false
    }
]

module.exports = PROXY_CONFIG;
