// auth.controller.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';


describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('успешный логин', async () => {
      const loginDto = { username: 'test', password: '1234Ab' };
      const mockUser = { id: 1, username: 'test' };
      const mockLoginResult = {
        access_token: 'jwt-token',
        user: mockUser
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockLoginResult);

      const result = await authController.login(loginDto);

      expect(result).toEqual({
        success: true,
        ...mockLoginResult
      });
      
      expect(mockAuthService.validateUser).toHaveBeenCalledWith('test', '1234Ab');
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('ошибка от validateUser', async () => {
      const loginDto = { username: 'test', password: 'wrong' };
      const error = new Error('Неверные данные');
      
      mockAuthService.validateUser.mockRejectedValue(error);

      await expect(authController.login(loginDto)).rejects.toThrow(error);
      
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('регистрация и логин пользователя', async () => {
      const registerDto = { username: 'test', password: '1234Ab' };
      const mockUser = { id: 2, username: 'test' };
      const mockLoginResult = {
        access_token: 'jwt-token',
        user: mockUser
      };

      mockAuthService.register.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockLoginResult);

      const result = await authController.register(registerDto);

      expect(result).toEqual({
        success: true,
        ...mockLoginResult
      });
      
      expect(mockAuthService.register).toHaveBeenCalledWith('test', '1234Ab');
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('ошибка от register', async () => {
      const registerDto = { username: 'test', password: '1234Ab' };
      const error = new Error('Пользователь уже существует');
      
      mockAuthService.register.mockRejectedValue(error);

      await expect(authController.register(registerDto)).rejects.toThrow(error);
      
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('success: true', async () => {
      const result = await authController.logout();

      expect(result).toEqual({ success: true });
    });
  });
});