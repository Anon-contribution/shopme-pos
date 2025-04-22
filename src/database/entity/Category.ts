import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '.';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { nullable: true })
  external_id: number | null;

  @Column('varchar')
  name: string;

  @OneToMany('Product', (product: Product) => product.category)
  products?: Product[];
}
