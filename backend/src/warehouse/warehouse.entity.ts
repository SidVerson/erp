import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.warehouse, {
    onDelete: 'CASCADE', // Добавляем каскадное удаление
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'in_stock', default: 0 })
  inStock: number;

  @Column({ name: 'expected', default: 0 })
  expected: number;
}
