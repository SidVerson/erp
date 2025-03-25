import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getNextOrderNumber(): Promise<string> {
    const lastOrder = await this.orderRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    const lastNumber = lastOrder[0]?.orderNumber || 'ORD-00000';
    const nextNum = parseInt(lastNumber.split('-')[1]) + 1;
    return `ORD-${nextNum.toString().padStart(5, '0')}`;
  }
}
