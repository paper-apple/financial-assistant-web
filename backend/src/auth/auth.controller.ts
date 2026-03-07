// auth.controller.ts
import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
  @Body() body: { username: string; password: string }) {
    // 1. Валидация пользователя
    const user = await this.authService.validateUser(body.username, body.password);
    
    // 2. Генерация JWT
    const result = await this.authService.login(user);
    
    // 3. Отправка токена (и опционально в cookie)
    return {
      success: true,
      ...result
    }; 
  }

  @Post('register')
  async register(@Body() body, @Res() res: Response) {
    const user = await this.authService.register(body.username, body.password);
    const result = await this.authService.login(user); // сразу логиним после регистрации
    
    return {
      success: true,
      ...result
    };
  }

  @Post('logout')
  async logout() {
    return { success: true };
  }
}