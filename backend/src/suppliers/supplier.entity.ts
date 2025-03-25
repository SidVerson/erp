import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({
    type: 'jsonb',
    nullable: false,
    default: { email: '', phone: '' },
  })
  contact_data: {
    email: string;
    phone: string;
  };
}
