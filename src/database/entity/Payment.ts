import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './Order';

export enum PaymentType {
  CHARGE = 0,
  REFUND = 1,
}

export enum PaymentMode {
  CASH = 0,
  CARD = 1,
  KHQR = 2,
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { nullable: true })
  external_id?: number | null;

  @Column('integer')
  type: number;

  @Column('integer')
  mode: number;

  @Column('integer')
  amount: number;

  @Column('datetime', { default: +new Date() })
  created_at: Date;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;
}
