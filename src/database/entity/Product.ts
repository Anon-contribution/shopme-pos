import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  // ManyToMany,
  OneToMany,
} from 'typeorm';
import { Category } from './Category';
// import { Order } from './Order';
import { OrderToProduct } from './OrderToProduct';

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

  @ManyToOne('Category', (category: Category) => category.products, { cascade: true })
  @JoinColumn()
  category: Category;

  // @ManyToMany(() => Order, (order) => order.products, { cascade: true })
  // orders: Order[];
  @OneToMany(() => OrderToProduct, (orderToProduct) => orderToProduct.product)
  public orderToProducts: OrderToProduct[];
}
