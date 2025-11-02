// src/auth/dto/register.dto.ts
import { IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MinLength(2, { message: 'Имя пользователя должно быть длиннее одного символа' })
  username: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @Matches(/[A-Z]/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
  @Matches(/[a-z]/, { message: 'Пароль должен содержать хотя бы одну строчную букву' })
  @Matches(/\d/, { message: 'Пароль должен содержать хотя бы одну цифру' })
  password: string;
}