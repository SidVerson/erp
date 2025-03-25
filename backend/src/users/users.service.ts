import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    email: string,
    password: string,
    role: 'customer' | 'admin' | 'manager' = 'customer',
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      email,
      passwordHash,
      role,
    });

    return this.usersRepository.save(user);
  }

  async findOne(email: string): Promise<User | undefined> {
    // @ts-ignore
    return this.usersRepository.findOne({ where: { email } });
  }
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  // Добавить метод
  async findOneById(id: number): Promise<User | undefined> {
    // @ts-ignore
    return this.usersRepository.findOneBy({ id });
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // @ts-ignore
    await this.usersRepository.update(id, updateUserDto);
    // @ts-ignore
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async updateRole(id: number, role: string): Promise<User> {
    // @ts-ignore
    await this.usersRepository.update(id, { role });
    // @ts-ignore
    return this.usersRepository.findOneBy({ id });
  }
}
