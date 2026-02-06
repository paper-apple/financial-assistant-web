// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    // Пробуем из cookie
    let userId = request.cookies?.userId;
    
    // Пробуем из заголовка (для Safari)
    if (!userId) {
      userId = request.headers['x-user-id'];
    }
    if (!userId) {
      throw new UnauthorizedException('Требуется авторизация');
    }
    
    request['userId'] = parseInt(userId);
    return true;
  }
}