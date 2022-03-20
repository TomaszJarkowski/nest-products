import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: typeof process.env.DB_PORT === 'number' ? process.env.DB_PORT : 3306,
    username: process.env.DB_USERNAME ?? 'newuser',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME ?? 'guruv2',
    entities: ['dist/**/**.entity{.ts,.js}'],
    bigNumberStrings: false,
    logging: true,
    synchronize: true,
  };
};
