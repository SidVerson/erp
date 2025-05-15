import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { StockInfo } from './warehouse.types';
import { Procurement } from '../procurements/procurement.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getStock(
    productId: number,
  ): Promise<{ inStock: number; expected: number }> {
    const record = await this.warehouseRepository.findOne({
      where: { product: { id: productId } },
      relations: ['product'], // Добавляем загрузку связанного продукта
    });

    return {
      inStock: record?.inStock || 0,
      expected: record?.expected || 0,
    };
  }

  async decreaseStock(productId: number, quantity: number): Promise<void> {
    await this.warehouseRepository.decrement(
      { product: { id: productId } },
      'inStock',
      quantity,
    );
  }

  async getAllStock(): Promise<StockInfo[]> {
    return this.warehouseRepository.find({
      relations: ['product'],
      order: { product: { name: 'ASC' } },
    });
  }

  async updateExpected(
    productId: number,
    quantity: number,
    isExpected: boolean,
  ): Promise<Warehouse> {
    const record = await this.warehouseRepository.findOne({
      where: { product: { id: productId } },
      relations: ['product'],
    });

    if (!record) {
      const newRecord = this.warehouseRepository.create({
        product: { id: productId },
        expected: isExpected ? 0 : quantity,
        inStock: isExpected ? quantity : 0,
      });
      return this.warehouseRepository.save(newRecord);
    }

    if (isExpected) {
      // Если дата в прошлом, сразу добавляем в inStock
      record.inStock += quantity;
    } else {
      // Если дата в будущем, добавляем в expected
      record.expected += quantity;
    }
    
    return this.warehouseRepository.save(record);
  }

  async processDelivery(procurement: Procurement): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // Уменьшаем ожидаемое количество
      await this.decreaseExpected(procurement.product.id, procurement.quantity);

      // Увеличиваем актуальные запасы
      await this.increaseStock(procurement.product.id, procurement.quantity);
    });
  }

  private async decreaseExpected(
    productId: number,
    quantity: number,
  ): Promise<void> {
    await this.warehouseRepository.decrement(
      { product: { id: productId } },
      'expected',
      quantity,
    );
  }

  private async increaseStock(
    productId: number,
    quantity: number,
  ): Promise<void> {
    await this.warehouseRepository.increment(
      { product: { id: productId } },
      'inStock',
      quantity,
    );
  }

  async updateStock(productId: number, inStock: number): Promise<Warehouse> {
    const record = await this.warehouseRepository.findOne({
      where: { product: { id: productId } },
    });
    if (!record) {
      const newRecord = this.warehouseRepository.create({
        product: { id: productId },
        inStock,
      });
      return this.warehouseRepository.save(newRecord);
    }
    record.inStock = inStock;
    return this.warehouseRepository.save(record);
  }
  async processImmediateDelivery(procurement: Procurement) {
    const deliveryDate = new Date(procurement.deliveryDate);

    if (deliveryDate <= new Date()) {
      await this.warehouseRepository.increment(
        { product: { id: procurement.product.id } },
        'inStock',
        procurement.quantity,
      );
    } else {
      await this.warehouseRepository.increment(
        { product: { id: procurement.product.id } },
        'expected',
        procurement.quantity,
      );
    }
  }
}
