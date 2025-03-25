import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementsService } from './procurements.service';
import { ProcurementsController } from './procurements.controller';
import { Procurement } from './procurement.entity';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { ProductsModule } from '../products/products.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { Supplier } from '../suppliers/supplier.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Procurement, Supplier, Product]),
    SuppliersModule,
    ProductsModule,
    WarehouseModule,
  ],
  providers: [ProcurementsService],
  controllers: [ProcurementsController],
  exports: [ProcurementsService], // Добавляем экспорт сервиса
})
export class ProcurementsModule {}
