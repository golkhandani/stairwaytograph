module.exports = {
    serviceURL: '/one',
    host : 'http://localhost',
    env: 'development', //process.env.NODE_ENV,
    port: 3030, //process.env.PORT,
    jwtSecret: 'bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4', //process.env.JWT_SECRET,
    jwtExpirationInterval: 15, //process.env.JWT_EXPIRATION_MINUTES,
    mongo: {
        uri: 'mongodb://localhost:27017/test',
        //     process.env.NODE_ENV === 'test'
        //   ? process.env.MONGO_URI
        //   : process.env.MONGO_URI,
    },
    logs: 'dev' //process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};