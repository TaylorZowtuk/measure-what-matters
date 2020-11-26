module.exports = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/**.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsRun: true,
  logging: true,
  logger: 'simple-console',
};
