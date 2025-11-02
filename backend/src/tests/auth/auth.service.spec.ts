// auth.service.spec.ts
import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../../users/users.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(() => {
    usersService = {
      validateUser: vi.fn(),
      create: vi.fn(),
    };

    authService = new AuthService(usersService as UsersService);
  });

  it("validateUser вызывает usersService.validateUser и возвращает результат", async () => {
    const user = { id: 1, username: "test" };
    (usersService.validateUser as any).mockResolvedValue(user);

    const result = await authService.validateUser("test", "123");

    expect(usersService.validateUser).toHaveBeenCalledWith("test", "123");
    expect(result).toEqual(user);
  });

  it("register вызывает usersService.create и возвращает результат", async () => {
    const newUser = { id: 2, username: "newUser" };
    (usersService.create as any).mockResolvedValue(newUser);

    const result = await authService.register("newUser", "123");

    expect(usersService.create).toHaveBeenCalledWith("newUser", "123");
    expect(result).toEqual(newUser);
  });
});