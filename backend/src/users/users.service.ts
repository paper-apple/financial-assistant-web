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

  private validateUsername(username: string): void {
    if (username.length < 2) {
      throw new ConflictException('Имя пользователя должно состоять из двух и более символов');
    }
    if (username.length > 30) {
      throw new ConflictException('Имя пользователя не должно быть более 30 символов');
    }
  }

  private validatePassword(password: string): void {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (password.length < 6 || !hasLowerCase || !hasUpperCase || !hasNumber) {
      throw new ConflictException(
        'Пароль должен содержать более 5 символов, цифры, строчные и заглавные буквы'
      );
    }
  }

  async create(username: string, password: string): Promise<User> {
    // 1. Проверка уникальности
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new ConflictException('Пользователь уже существует');
    }
    
    // 2. Валидация формата
    this.validateUsername(username);
    this.validatePassword(password);

    // 3. Создание пользователя
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
    
    return user;
  }
}