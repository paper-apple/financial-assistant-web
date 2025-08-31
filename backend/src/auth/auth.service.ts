// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async validateUser(username: string, password: string): Promise<any> {
//     return await this.usersService.validateUser(username, password);
//   }

//   async login(user: any) {
//     const payload = { username: user.username, sub: user.id };
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.id,
//         username: user.username,
//       },
//     };
//   }

//   async register(createUserDto: any) {
//     const user = await this.usersService.create(createUserDto);
//     return this.login(user);
//   }
// }

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    return this.usersService.validateUser(username, password);
  }

  async register(username: string, password: string) {
    return this.usersService.create(username, password);
  }
}