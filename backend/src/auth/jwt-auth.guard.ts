// auth/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Добавляем кастомную логику если нужно
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // info содержит детали ошибки (например, 'jwt expired')
    if (err || !user) {
      throw err || new UnauthorizedException('Недействительный токен');
    }
    return user;
  }
}