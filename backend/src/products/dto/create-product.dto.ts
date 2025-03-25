import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  supplierId: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
