// auth.controller.ts
import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    const result = await this.authService.login(user);
    return {
      success: true,
      ...result
    }; 
  }

  @Post('register')
  async register(@Body() body) {
    const user = await this.authService.register(body.username, body.password);
    const result = await this.authService.login(user); // Сразу авторизация после создания
    
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