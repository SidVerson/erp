import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from '../suppliers/supplier.entity';
import { Warehouse } from '../warehouse/warehouse.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  warehouse: Warehouse[];
}
