// auth.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response
  ) {
    const user = await this.authService.validateUser(body.username, body.password);

    res.cookie('userId', user.id.toString(), {
      httpOnly: true,
      secure: false, // в production — true
      sameSite: 'lax',
    });

    return res.json({
      success: true,
      user: { id: user.id, username: user.username }
    });
  }

  @Post('register')
  async register(@Body() body, @Res() res: Response) {
    const user = await this.authService.register(body.username, body.password);

    res.cookie('userId', user.id.toString(), {
      httpOnly: true,
      secure: false, // в production — true
      sameSite: 'lax',
    });

    return res.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('userId');
    return res.json({ success: true });
  }
}