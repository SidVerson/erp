import { IsDateString, IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateProcurementDto {
  @IsInt()
  @IsPositive()
  supplierId: number;

  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsDateString()
  deliveryDate: Date;

  @IsNumber()
  @IsPositive()
  price: number;
}
