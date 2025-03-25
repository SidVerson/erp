import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { OrderItem } from './order-item.entity';
import { OrderNumberSequence } from './order-number.sequence';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    ProductsModule,
    WarehouseModule,
  ],
  providers: [OrdersService, OrderNumberSequence],
  controllers: [OrdersController],
})
export class OrdersModule {}
