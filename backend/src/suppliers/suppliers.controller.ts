import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './supplier.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Roles('admin', 'manager')
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @Roles('admin', 'manager')
  async findAll(): Promise<Supplier[]> {
    return this.suppliersService.findAll();
  }
}
