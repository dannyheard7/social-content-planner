const host = process.env.TYPEORM_HOST || 'localhost';
const username = process.env.TYPEORM_USERNAME || 'postgres';
const password = process.env.TYPEORM_PASSWORD || '';
const database = process.env.TYPEORM_DATABASE || 'content_planner';
const port = process.env.TYPEORM_PORT || '5432';

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
  entities: [
    __dirname + '/src/**/*.entity.ts',
    __dirname + '/dist/**/*.entity.js',
  ],
  migrations: ['migrations/**/*.ts'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'migrations',
  },
};
