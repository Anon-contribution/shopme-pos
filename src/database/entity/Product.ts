import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Category } from './Category';
import { Order } from './Order';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { nullable: true })
  external_id: number;

  @Column('varchar')
  label: string;

  @Column('integer')
  price: number;

  @ManyToOne('Category', (category: Category) => category.products, { cascade: ['insert'] })
  @JoinColumn()
  category: Category;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}
