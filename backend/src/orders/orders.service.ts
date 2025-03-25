import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private usersService: UsersService,
    private productsService: ProductsService,
    private warehouseService: WarehouseService,
    private dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const client = await this.usersService.findOneById(
        createOrderDto.clientId,
      );
      if (!client) throw new NotFoundException('Client not found');

      const orderNumber = await this.getNextOrderNumber();

      const order = this.ordersRepository.create({
        orderNumber,
        client,
        status: 'pending',
        shipmentDate: new Date(createOrderDto.shipmentDate),
        totalPrice: 0,
      });

      let totalPrice = 0;
      const items: OrderItem[] = [];

      // Обрабатываем все товары в заказе
      for (const item of createOrderDto.items) {
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          throw new ConflictException(`Товар с ID ${item.productId} не найден`);
        }

        const stock = await this.warehouseService.getStock(item.productId);
        if (stock.inStock < item.quantity) {
          const available =
            stock.inStock > 0
              ? `Доступно: ${stock.inStock}`
              : 'Товар отсутствует';
          throw new ConflictException(
            `Недостаточно товара "${product.name}". ${available}\n` +
              'Пожалуйста, создайте закупку в соответствующем разделе.',
          );
        }

        // Создаем OrderItem и добавляем в массив
        const orderItem = this.orderItemsRepository.create({
          product,
          quantity: item.quantity,
          price: product.price,
        });
        items.push(orderItem);

        // Обновляем общую сумму
        totalPrice += product.price * item.quantity;

        // Уменьшаем остатки на складе
        await this.warehouseService.decreaseStock(
          item.productId,
          item.quantity,
        );
      }

      // Устанавливаем итоговые значения после обработки всех товаров
      order.totalPrice = totalPrice;
      order.items = items;

      // Сохраняем заказ
      return manager.save(order);
    });
  }

  private async getNextOrderNumber(): Promise<string> {
    const lastOrder = await this.ordersRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    const lastNumber = lastOrder[0]?.orderNumber || 'ORD-00000';
    const nextNum = parseInt(lastNumber.split('-')[1]) + 1;
    return `ORD-${nextNum.toString().padStart(5, '0')}`;
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new ConflictException('Invalid status');
    }

    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new ConflictException('Order not found');
    // @ts-ignore
    order.status = status;
    return this.ordersRepository.save(order);
  }
  async findAllByFilters(filters?: {
    clientId?: number;
    status?: string;
  }): Promise<Order[]> {
    const query = this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.client', 'client')
      .leftJoinAndSelect('orders.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (filters?.clientId) {
      query.where('orders.client_id = :clientId', {
        clientId: filters.clientId,
      });
    }

    if (filters?.status) {
      query.andWhere('orders.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async findAll(status?: string): Promise<Order[]> {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (status) {
      query.where('order.status = :status', { status });
    }

    return query.getMany();
  }
}
