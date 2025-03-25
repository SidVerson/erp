import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Order } from './order.entity';
import { Response } from 'express';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('admin', 'manager')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Put(':id/status')
  @Roles('admin', 'manager')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'in_progress' | 'completed',
  ) {
    return this.ordersService.updateStatus(parseInt(id), status);
  }

  @Get()
  @Roles('admin', 'manager')
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  async getMyOrders(@Req() req: any) {
    return this.ordersService.findAllByFilters({
      clientId: req.user.id,
      status: req.query.status,
    });
  }

  // В метод exportToCSV
  @Get('export')
  @Roles('admin', 'manager')
  async exportToCSV(@Res({ passthrough: true }) res: Response) {
    const orders = await this.ordersService.findAll();
    const csv = this.generateCSV(orders);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    return csv;
  }

  private generateCSV(orders: Order[]): string {
    const headers = [
      'Order Number',
      'Client Email',
      'Status',
      'Total Price',
      'Shipment Date',
    ];
    const rows = orders.map((order) => [
      order.orderNumber,
      order.client.email,
      order.status,
      order.totalPrice.toFixed(2),
      order.shipmentDate?.toISOString().split('T')[0] || 'N/A',
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }
}
