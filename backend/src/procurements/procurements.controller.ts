import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProcurementsService } from './procurements.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('procurements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcurementsController {
  constructor(private readonly procurementsService: ProcurementsService) {}

  @Post()
  @Roles('admin', 'manager')
  async create(@Body() createProcurementDto: CreateProcurementDto) {
    return this.procurementsService.createProcurement(createProcurementDto);
  }

  @Put(':id/delivery-date')
  @Roles('admin', 'manager')
  async updateDeliveryDate(
    @Param('id') id: string,
    @Body('deliveryDate') deliveryDate: Date,
  ) {
    return this.procurementsService.updateDeliveryDate(
      parseInt(id),
      deliveryDate,
    );
  }

  @Get()
  @Roles('admin', 'manager')
  async findAll() {
    return this.procurementsService.findAll();
  }
}
