// jwt-auth.guard.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';;

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    
    mockRequest = {
      headers: {},
      user: null,
    };
    
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  });

  it('возврат пользователя при отсутствии ошибов', () => {
    const mockUser = { id: 1, username: 'test' };
    
    const result = guard.handleRequest(null, mockUser, null);
    
    expect(result).toEqual(mockUser);
  });

  it('UnauthorizedException при наличии ошибок', () => {
    const error = new Error('jwt expired');
    
    expect(() => guard.handleRequest(error, null, null))
      .toThrow(UnauthorizedException);
  });

  it('UnauthorizedException при отсутствии пользователя', () => {
    expect(() => guard.handleRequest(null, null, null))
      .toThrow(UnauthorizedException);
  });

  it('возврат исключения с сообщением о недействительном токене', () => {
    const info = { message: 'jwt expired' };
    
    try {
      guard.handleRequest(null, null, info);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Недействительный токен');
    }
  });
});