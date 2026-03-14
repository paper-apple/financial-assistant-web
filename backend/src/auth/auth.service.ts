// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    return this.usersService.validateUser(username, password);
  }

  async register(username: string, password: string) {
    return this.usersService.create(username, password);
  }

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      username: user.username 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username
      }
    };
  }
}