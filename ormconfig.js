const { NODE_ENV, PG_HOSTNAME, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

module.exports = {
    name: "default",
    type: "postgres",
    host: PG_HOSTNAME || "localhost",
    database: PG_DATABASE || "test",
    username: PG_USERNAME,
    password: PG_PASSWORD,
    synchronize: NODE_ENV !== "production",
    entities: [
        join(__dirname, "database/models/*.ts")
    ]
}