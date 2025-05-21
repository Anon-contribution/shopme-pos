import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';
import { Order } from './Order';

@Entity()
export class OrderToProduct {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('integer')
  public orderId: number;

  @Column('integer')
  public productId: number;

  @Column('integer')
  public quantity: number;

  @ManyToOne(() => Order, (order) => order.orderToProducts)
  public order: Order;

  @ManyToOne(() => Product, (product) => product.orderToProducts)
  public product: Product;
}
