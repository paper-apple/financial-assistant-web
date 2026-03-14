// auth.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '@/auth/auth.service';

describe('AuthService', () => {
  const mockUsersService = {
    validateUser: vi.fn(),
    create: vi.fn(),
  };

  const mockJwtService = {
    sign: vi.fn(),
  };

  const authService = new AuthService(
    mockUsersService as any,
    mockJwtService as any
  );

  it('validateUser работает', async () => {
    mockUsersService.validateUser.mockResolvedValue({ id: 1 });
    
    const result = await authService.validateUser('test', '1234Ab');
    
    expect(result).toEqual({ id: 1 });
  });

  it('register работает', async () => {
    mockUsersService.create.mockResolvedValue({ id: 2 });
    
    const result = await authService.register('test', '1234Ab');
    
    expect(result).toEqual({ id: 2 });
  });

  it('login возвращает токен', async () => {
    mockJwtService.sign.mockReturnValue('token');
    
    const result = await authService.login({ id: 1, username: 'test' });
    
    expect(result.access_token).toBe('token');
    expect(result.user.id).toBe(1);
  });
});