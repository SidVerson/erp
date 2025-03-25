import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcurementsService } from '../procurements/procurements.service';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class StockUpdateTask {
  private readonly logger = new Logger(StockUpdateTask.name);

  constructor(
    private readonly procurementsService: ProcurementsService,
    private readonly warehouseService: WarehouseService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleStockUpdate() {
    const procurements = await this.procurementsService.findOverdueDeliveries();

    for (const procurement of procurements) {
      // Если дата прошла, сразу перемещаем в "В наличии"
      await this.warehouseService.processImmediateDelivery(procurement);
      await this.procurementsService.markAsDelivered(procurement.id);
    }
  }
}
