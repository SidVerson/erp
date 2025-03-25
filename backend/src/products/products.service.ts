import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { SuppliersService } from '../suppliers/suppliers.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private suppliersService: SuppliersService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['supplier'] });
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['warehouse', 'supplier'],
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const supplier = await this.suppliersService.findOne(
      createProductDto.supplierId,
    );
    if (!supplier) throw new NotFoundException('Supplier not found');

    const product = this.productsRepository.create({
      ...createProductDto,
      supplier,
    });

    return this.productsRepository.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    if (updateProductDto.supplierId) {
      product.supplier = await this.suppliersService.findOne(
        updateProductDto.supplierId,
      );
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    // Удаление через QueryBuilder для обработки связей
    await this.productsRepository
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where('id = :id', { id })
      .execute();
  }
}
