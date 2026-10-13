import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { InitialSchema1735689600000 } from './migrations/1735689600000-InitialSchema';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'seven_candles',
  synchronize: false,
  migrations: [InitialSchema1735689600000],
});