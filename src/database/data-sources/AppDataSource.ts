import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Initial1744870604544 } from '../migrations/1744870604544-Initial';

import { Category } from '../entity/Category';
import { Order } from '../entity/Order';
import { Payment } from '../entity/Payment';
import { Product } from '../entity/Product';
import { OrderToProduct } from './../entity/OrderToProduct';

export const DBName = 'shopmeDB';

export const connection = new SQLiteConnection(CapacitorSQLite);

const AppDataSource = new DataSource({
  type: 'capacitor',
  driver: connection,
  database: DBName,
  mode: 'no-encryption',
  entities: [Category, Order, Payment, Product, OrderToProduct],
  migrations: [Initial1744870604544],
  logging: ['error', 'query', 'schema'],
  synchronize: false,
  migrationsRun: false,
});

export default AppDataSource;
