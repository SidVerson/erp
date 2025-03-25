import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { ProductsModule } from '../products/products.module';
import { WarehouseController } from './warehouse.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse]), ProductsModule],
  providers: [WarehouseService],
  exports: [WarehouseService],
  controllers: [WarehouseController],
})
export class WarehouseModule {}
