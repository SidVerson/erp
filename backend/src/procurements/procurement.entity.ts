import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from '../suppliers/supplier.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Procurement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ name: 'delivery_date' })
  deliveryDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  // Добавляем вычисляемое поле
  get totalPrice(): number {
    return this.unitPrice * this.quantity;
  }

  @Column({ default: false })
  delivered: boolean;
}
