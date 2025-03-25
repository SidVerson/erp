import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { AuditService } from '../audit/audit.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditService: AuditService, // Добавляем сервис
  ) {}

  @Get()
  @Roles('admin')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Другие методы по необходимости
  // В метод создания пользователя
  // src/users/users.controller.ts
  @Post()
  @Roles('admin')
  async create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const user = await this.usersService.create(
      createUserDto.email,
      createUserDto.password, // Добавляем пароль
      createUserDto.role, // Добавляем роль
    );

    if (this.auditService) {
      // Добавляем проверку
      await this.auditService.log(req.user, 'USER_CREATED', {
        createdUserId: user.id,
      });
    }

    return user;
  }
  @Put(':id')
  @Roles('admin')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    const user = await this.usersService.update(+id, updateUserDto);
    await this.auditService.log(req.user, 'USER_UPDATED', { userId: id });
    return user;
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string, @Req() req) {
    await this.usersService.remove(+id);
    await this.auditService.log(req.user, 'USER_DELETED', { userId: id });
    return { message: 'User deleted successfully' };
  }
  @Put(':id/role')
  @Roles('admin')
  async updateRole(
    @Param('id') id: string,
    @Body() { role }: { role: string },
    @Req() req: any,
  ) {
    const user = await this.usersService.updateRole(+id, role);
    await this.auditService.log(req.user, 'USER_ROLE_UPDATED', {
      userId: id,
      newRole: role,
    });
    return user;
  }
}
