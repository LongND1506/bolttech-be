// src/db/data-source.ts
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  seeds: ['dist/infrastructures/seeds/*.seed{.ts,.js}'],
  synchronize: true,
  extra: {
    decimalNumbers: true,
  }, // do not set it true in production application
};
export default new DataSource(dataSourceOptions);
