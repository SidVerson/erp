import { IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;
}
