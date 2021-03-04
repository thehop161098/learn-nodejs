const config = {
    database: {
        ip: "localhost:27017",
        name: "ot_wallet",
        // name: "ot_receipts_expenses",
        options: {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false,
            reconnectInterval: 500,
            poolSize: 100,
            bufferMaxEntries: 0,
            connectTimeoutMS: 100000,
            socketTimeoutMS: 100000,
            family: 4
        }
    },
    port: "3001",
    secret_session: 'LucjferDevil',
    jwt_secret: 'LucjferDevil',
    length_salt: 10
}

module.exports = config;