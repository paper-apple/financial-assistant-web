// jwt.strategy.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { UsersService } from '@/users/users.service';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService: UsersService;

  const mockUsersService = {
    findById: vi.fn(),
  };

  beforeEach(() => {
    jwtStrategy = new JwtStrategy(mockUsersService as any);
    vi.clearAllMocks();
  });

  it('создание с правильными настройками', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('возврат пользователя, если он найден', async () => {
    const payload = { sub: 123, username: 'test' };
    const mockUser = { id: 123, username: 'test' };
    
    mockUsersService.findById.mockResolvedValue(mockUser);

    const result = await jwtStrategy.validate(payload);

    expect(result).toEqual(mockUser);
    expect(mockUsersService.findById).toHaveBeenCalledWith(123);
    expect(mockUsersService.findById).toHaveBeenCalledTimes(1);
  });

  it('UnauthorizedException, если пользователь не найден', async () => {
    const payload = { sub: 999, username: 'unknown' };
    
    mockUsersService.findById.mockResolvedValue(null); // пользователь не найден

    await expect(jwtStrategy.validate(payload))
      .rejects.toThrow(UnauthorizedException);
    
    expect(mockUsersService.findById).toHaveBeenCalledWith(999);
  });

  it('поиск пользователя по полю sub', async () => {
    const payload = { sub: 123, username: 'test', iat: 12345, exp: 67890 };
    const mockUser = { id: 123, username: 'test' };
    
    mockUsersService.findById.mockResolvedValue(mockUser);

    const result = await jwtStrategy.validate(payload);

    expect(mockUsersService.findById).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockUser);
  });

  it('работа с любым payload, содержащим sub', async () => {
    const payloads = [
      { sub: 1, name: 'test' },
      { sub: 2, email: 'test@mail.com' },
      { sub: 3, role: 'admin' },
    ];

    for (const payload of payloads) {
      const mockUser = { id: payload.sub, username: 'test' };
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await jwtStrategy.validate(payload);

      expect(mockUsersService.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual(mockUser);
      
      vi.clearAllMocks();
    }
  });
});