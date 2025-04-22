import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './Product';
import { Payment } from './Payment';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column('integer', { nullable: true })
  external_id: number | null;

  @Column('varchar', { nullable: true })
  tab_payer: string | null;

  @ManyToMany(() => Product, (product) => product.orders, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  products: Product[];

  @OneToMany(() => Payment, (payment) => payment.order, { eager: true, cascade: true })
  payments: Payment[];

  @Index()
  @CreateDateColumn()
  created_at: Date | null;
}
