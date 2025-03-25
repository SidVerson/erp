import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.suppliersRepository.create({
      name: createSupplierDto.name,
      address: createSupplierDto.address,
      contact_data: {
        email: createSupplierDto.email,
        phone: createSupplierDto.phone,
      },
    });

    console.log('Creating supplier:', supplier); // Добавим логирование
    return this.suppliersRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.suppliersRepository.find();
  }

  async findOne(id: number): Promise<Supplier | undefined> {
    // @ts-ignore
    return this.suppliersRepository.findOneBy({ id });
  }
}
