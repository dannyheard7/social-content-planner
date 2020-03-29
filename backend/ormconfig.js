const host = process.env.TYPEORM_HOST;
const username = process.env.TYPEORM_USERNAME;
const password = process.env.TYPEORM_PASSWORD;
const database = process.env.TYPEORM_DATABASE;
const port = process.env.TYPEORM_PORT;

module.exports = {
    type: 'postgres',
    host: host,
    port: parseInt(port),
    username,
    password,
    database: database,
    synchronize: false,
    dropSchema: false,
    logging: true,
    entities: [__dirname + '/src/**/*.entity.ts', __dirname + '/dist/**/*.entity.js'],
    cli: {
        entitiesDir: 'src',
    },
};
