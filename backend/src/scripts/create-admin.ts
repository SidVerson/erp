// import { UsersService } from '../users/users.service';
// import { ConfigService } from '@nestjs/config';
//
// export async function createAdmin(
//   usersService: UsersService,
//   config: ConfigService,
// ) {
//   const adminEmail = config.get('ADMIN_EMAIL');
//   const adminPassword = config.get('ADMIN_PASSWORD');
//
//   try {
//     await usersService.create(adminEmail, adminPassword, 'admin');
//     console.log('Admin user created successfully');
//   } catch (error) {
//     console.log('Admin user already exists');
//   }
// }
//
// // Добавьте вызов в main.ts после инициализации приложения
