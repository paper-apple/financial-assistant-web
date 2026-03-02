// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    return this.usersService.validateUser(username, password);
  }

  async register(username: string, password: string) {
    return this.usersService.create(username, password);
  }

  setUserIdCookie(res: any, userId: number) {
    res.cookie('userId', userId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
  }

  formatUserResponse(user: any) {
    return {
      success: true,
      user: { id: user.id, username: user.username },
      userId: user.id.toString(),
    };
  }
}