import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createAdminUser();
  }

  private async createAdminUser() {
    const adminEmail = this.configService.get('ADMIN_EMAIL');
    const adminPassword = this.configService.get('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      console.warn('Admin credentials not found in .env file');
      return;
    }

    const existingAdmin = await this.usersService.findOne(adminEmail);

    if (existingAdmin) {
      console.log(existingAdmin);
      console.log('Admin user already exists');
      return;
    }

    await this.usersService.create(adminEmail, adminPassword, 'admin');

    console.log('Admin user created successfully');
  }
}
