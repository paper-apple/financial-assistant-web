// users.service.spec.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Repository } from "typeorm";
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/users.service";

describe("UsersService", () => {
  let service: UsersService;
  let usersRepository: Partial<Repository<User>>;

  beforeEach(() => {
    usersRepository = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };

    service = new UsersService(usersRepository as Repository<User>);

    vi.mock("bcrypt", () => ({
      hash: vi.fn(async (pwd: string) => `hashed-${pwd}`),
      compare: vi.fn(async (pwd: string, hash: string) => hash === `hashed-${pwd}`),
    }));
  });

  it("create создаёт нового пользователя", async () => {
    (usersRepository.findOne as any).mockResolvedValue(null);
    (usersRepository.create as any).mockImplementation((u: User) => u);
    (usersRepository.save as any).mockImplementation((u: User) => ({ ...u, id: 1 }));

    const result = await service.create("newUser", "12345");

    expect(result).toEqual({
      id: 1,
      username: "newUser",
      password: "hashed-12345",
      expenses: undefined,
    });
    expect(usersRepository.create).toHaveBeenCalled();
    expect(usersRepository.save).toHaveBeenCalled();
  });

  it("create выбрасывает ConflictException, если пользователь уже существует", async () => {
    const existing: User = { id: 1, username: "exists", password: "hashed", expenses: [] };
    (usersRepository.findOne as any).mockResolvedValue(existing);

    await expect(service.create("exists", "12345")).rejects.toThrow(ConflictException);
  });

  it("validateUser возвращает пользователя при правильном пароле", async () => {
    const user: User = { id: 1, username: "test", password: "hashed-12345", expenses: [] };
    (usersRepository.findOne as any).mockResolvedValue(user);

    const result = await service.validateUser("test", "12345");
    expect(result).toEqual(user);
  });

  it("validateUser выбрасывает NotFoundException, если пользователь не найден", async () => {
    (usersRepository.findOne as any).mockResolvedValue(null);

    await expect(service.validateUser("ghost", "12345")).rejects.toThrow(NotFoundException);
  });

  it("validateUser выбрасывает UnauthorizedException, если пароль неверный", async () => {
    const user: User = { id: 1, username: "test", password: "hashed-99999", expenses: [] };
    (usersRepository.findOne as any).mockResolvedValue(user);

    await expect(service.validateUser("test", "12345")).rejects.toThrow(UnauthorizedException);
  });
});