// import { Injectable, ConflictException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async create(createUserDto: CreateUserDto): Promise<User> {
//     const { username, password } = createUserDto;

//     // Проверяем, существует ли пользователь
//     const existingUser = await this.userRepository.findOne({ where: { username } });
//     if (existingUser) {
//       throw new ConflictException('Пользователь с таким именем уже существует');
//     }

//     // Хешируем пароль
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Создаем пользователя
//     const user = this.userRepository.create({
//       username,
//       password: hashedPassword,
//     });

//     return await this.userRepository.save(user);
//   }

//   async findOne(username: string): Promise<User | undefined> {
//     return await this.userRepository.findOne({ where: { username } });
//   }

//   async validateUser(username: string, password: string): Promise<User | null> {
//     const user = await this.findOne(username);
//     if (user && await bcrypt.compare(password, user.password)) {
//       return user;
//     }
//     return null;
//   }

//   async findById(id: number): Promise<User | undefined> {
//     return await this.userRepository.findOne({ where: { id } });
//   }
// }

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(username: string, password: string): Promise<User> {
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new ConflictException('Пользователь уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOne(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}