import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class OrderNumberSequence {
  constructor(private dataSource: DataSource) {}

  async getNextValue(): Promise<string> {
    const result = await this.dataSource.query(
      "SELECT nextval('order_number_seq') AS value",
    );
    return `ORD-${result[0].value.toString().padStart(6, '0')}`;
  }
}
