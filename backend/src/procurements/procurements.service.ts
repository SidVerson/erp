import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Procurement } from './procurement.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Product } from '../products/product.entity';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class ProcurementsService {
  constructor(
    @InjectRepository(Procurement)
    private procurementsRepository: Repository<Procurement>,
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private warehouseService: WarehouseService,
  ) {}

  async createProcurement(createProcurementDto: {
    supplierId: number;
    productId: number;
    quantity: number;
    deliveryDate: Date;
    price: number;
  }) {
    const supplier = await this.suppliersRepository.findOneBy({
      id: createProcurementDto.supplierId,
    });
    const product = await this.productsRepository.findOneBy({
      id: createProcurementDto.productId,
    });

    if (!supplier || !product) {
      throw new Error('Supplier or Product not found');
    }

    // Устанавливаем время в полночь по локальному времени
    const deliveryDate = new Date(createProcurementDto.deliveryDate);
    const offset = deliveryDate.getTimezoneOffset();
    deliveryDate.setHours(0, -offset, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const procurement = this.procurementsRepository.create({
      supplier,
      product,
      quantity: createProcurementDto.quantity,
      deliveryDate: deliveryDate,
      delivered: deliveryDate <= now,
      unitPrice: product.price,
    });

    const savedProcurement = await this.procurementsRepository.save(procurement);

    // Обновляем количество на складе
    await this.warehouseService.updateExpected(
      createProcurementDto.productId,
      createProcurementDto.quantity,
      deliveryDate <= now, // передаем true если дата в прошлом
    );

    return savedProcurement;
  }

  async updateDeliveryDate(id: number, newDate: Date) {
    const procurement = await this.procurementsRepository.findOneBy({ id });
    if (!procurement) throw new Error('Procurement not found');

    // Устанавливаем время в полночь по локальному времени
    const deliveryDate = new Date(newDate);
    const offset = deliveryDate.getTimezoneOffset();
    deliveryDate.setHours(0, -offset, 0, 0);
    
    procurement.deliveryDate = deliveryDate;
    procurement.delivered = deliveryDate <= new Date();
    
    // Обновляем статус на складе
    if (procurement.delivered) {
        await this.warehouseService.processImmediateDelivery(procurement);
    }
    
    return this.procurementsRepository.save(procurement);
  }

  async findOverdueDeliveries(): Promise<Procurement[]> {
    return this.procurementsRepository
      .createQueryBuilder('procurement')
      .where('procurement.deliveryDate <= :now', { now: new Date() })
      .andWhere('procurement.delivered = false')
      .leftJoinAndSelect('procurement.product', 'product')
      .getMany();
  }

  async markAsDelivered(id: number): Promise<void> {
    await this.procurementsRepository.update(id, { delivered: true });
  }

  async findAll() {
    return this.procurementsRepository.find({
      relations: ['supplier', 'product'],
      order: { deliveryDate: 'ASC' },
    });
  }
}
