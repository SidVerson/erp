import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('warehouse')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @Roles('admin', 'manager')
  async getStock(@Query('productId') productId?: number) {
    if (productId) {
      return this.warehouseService.getStock(productId);
    }
    return this.warehouseService.getAllStock();
  }

  // Добавим новый метод
  @Get('all')
  @Roles('admin', 'manager')
  async getAllStock() {
    return this.warehouseService.getAllStock();
  }
}
