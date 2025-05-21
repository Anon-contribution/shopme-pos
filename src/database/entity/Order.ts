import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  // ManyToMany,
  OneToMany,
  // JoinTable,
  Index,
  CreateDateColumn,
} from 'typeorm';
// import { Product } from './Product';
import { Payment } from './Payment';
import { OrderToProduct } from './OrderToProduct';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column('integer', { nullable: true })
  external_id: number | null;

  @Column('varchar', { nullable: true })
  tab_payer: string | null;

  // @ManyToMany(() => Product, (product) => product.orders, {
  //   eager: true,
  //   // cascade: true,
  // })
  // @JoinTable()
  // products: Product[];

  @OneToMany(() => OrderToProduct, (orderToProduct) => orderToProduct.order)
  public orderToProducts: OrderToProduct[];

  @OneToMany(() => Payment, (payment) => payment.order, { eager: true, cascade: true })
  payments: Payment[];

  @Index()
  @CreateDateColumn()
  created_at: Date | null;

  duplicatedProducts?: unknown[];
}
