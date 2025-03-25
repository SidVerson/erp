import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductsModule } from './products/products.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ProcurementsModule } from './procurements/procurements.module';
import { OrdersModule } from './orders/orders.module';
import { AuditModule } from './audit/audit.module';
import { InitModule } from './init/init.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StockUpdateTask } from './tasks/stock-update.task';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true, // Включаем логирование SQL
        logger: 'advanced-console',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SuppliersModule,
    ProductsModule,
    WarehouseModule,
    ProcurementsModule,
    OrdersModule,
    AuditModule,
    InitModule,
  ],
  providers: [
    StockUpdateTask,
    // ... другие провайдеры
  ],
})
export class AppModule {}
