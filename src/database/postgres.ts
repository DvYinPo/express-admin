import { DataSourceOptions, DataSource } from 'typeorm';
import * as Model from '../model';

const options: DataSourceOptions = {
  name: 'postgres',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: true,
  /* Indicates if database schema should be auto created on every application launch. */
  synchronize: true,
  entities: Object.values(Model),
};

const dataSource = new DataSource(options);
dataSource.initialize().then(
  (dataSource) => console.log('database connected!'),
  (error) => console.log('Cannot connect: ', error),
);

export default dataSource;
