import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  })
  status: 'pending' | 'in_progress' | 'completed';

  @Column({ name: 'shipment_date', nullable: true })
  shipmentDate: Date;

  @Column({ name: 'total_price', type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  items: OrderItem[];
}
