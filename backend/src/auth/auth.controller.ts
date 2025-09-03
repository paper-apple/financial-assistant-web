// import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateUserDto } from '../users/dto/create-user.dto';
// import { LocalAuthGuard } from './local-auth.guard';
// // import { LocalAuthGuard } from './local-auth.guard';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @UseGuards(LocalAuthGuard)
//   @Post('login')
//   async login(@Request() req) {
//     return this.authService.login(req.user);
//   }

//   @Post('register')
//   async register(@Body() createUserDto: CreateUserDto) {
//     return this.authService.register(createUserDto);
//   }
// }

import { Controller, Post, Body, Res, UnauthorizedException } from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('login')
  // async login(@Body() body: { username: string; password: string }, @Res() res: Response) {
  //   const user = await this.authService.validateUser(body.username, body.password);
  //   if (!user) throw new UnauthorizedException('Неверные данные');

  //   res.cookie('userId', user.id, { httpOnly: true, sameSite: 'lax', // или 'none' если фронт и бэк на разных доменах
  // secure: false, domain: 'http://192.168.100.4:3000' });
  //   return res.json({ success: true, user: { id: user.id, username: user.username } });
  // }


//   @Post('login')
//   async login(@Body() body, @Res() res: Response) {
//   try {
//     const user = await this.authService.validateUser(body.username, body.password);
//     if (!user) throw new UnauthorizedException('Неверные данные');
//     console.log(user)
//     res.cookie('userId', user.id, {
//       httpOnly: true,
//       sameSite: 'none',
//       secure: true,
//     });

//     return res.json({ success: true, user: { id: user.id, username: user.username } });
//   } catch (err) {
//     console.error('Ошибка при логине:', err);
//     throw err; // или new InternalServerErrorException('Ошибка сервера')
//   }
// }

  @Post('login')
  async login(@Body() body: { username: string; password: string }, @Res() res: Response) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) throw new UnauthorizedException('Неверные данные');

    res.cookie('userId', user.id, { 
      httpOnly: true,
      sameSite: 'none',
      secure: true, // false для localhost, true для production
    });
    
    return res.json({ success: true, user: { id: user.id, username: user.username } });
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const user = await this.authService.register(body.username, body.password);
    return { success: true, user: { id: user.id, username: user.username } };
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('userId', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });
    console.log('clear');
    return res.json({ success: true });
}

}