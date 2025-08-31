// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// // import { AuthService } from './auth.service';
// // import { AuthController } from './auth.controller';
// import { UsersModule } from '../users/users.module';
// import { JwtStrategy } from './jwt.strategy';
// import { LocalStrategy } from './local.strategy';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// @Module({
//   imports: [
//     UsersModule,
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'secretKey', // В production используйте переменные окружения
//       signOptions: { expiresIn: '7d' }, // Токен действителен 7 дней
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, LocalStrategy, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}