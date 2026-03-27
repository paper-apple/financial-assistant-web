// users.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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
    return this.usersRepository.findOne({ 
      where: { username },
      select: ['id', 'username', 'password']
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'username']
    });
  }

  private validateUsername(username: string): void {
    if (username.length < 2) {
      throw new ConflictException('error_short_username');

    }
    if (username.length > 30) {
      throw new ConflictException('error_long_username');
    }
  }

  private validatePassword(password: string): void {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (password.length < 6 || !hasLowerCase || !hasUpperCase || !hasNumber) {
      throw new ConflictException(
        'incorrect_password'
      );
    }
  }

  async create(username: string, password: string): Promise<User> {
    // Проверка уникальности
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new ConflictException('user_exist');
    }
    
    // Валидация формата
    this.validateUsername(username);
    this.validatePassword(password);

    // Создание пользователя
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findOne(username);
    if (!user) {
      throw new UnauthorizedException('invalid_username_or_password');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('invalid_username_or_password');
    }
    
    return user;
  }
}