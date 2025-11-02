// auth.controller.spec.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Response } from "express";
import { AuthController } from "../../auth/auth.controller";
import { AuthService } from "../../auth/auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;
  let res: Partial<Response>;

  beforeEach(() => {
    authService = {
      validateUser: vi.fn(),
      register: vi.fn(),
    };

    res = {
      cookie: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
    };

    controller = new AuthController(authService as AuthService);
  });

  it("login вызывает validateUser и устанавливает cookie", async () => {
    const user = { id: 1, username: "test" };
    (authService.validateUser as any).mockResolvedValue(user);

    await controller.login({ username: "test", password: "123" }, res as Response);

    expect(authService.validateUser).toHaveBeenCalledWith("test", "123");
    expect(res.cookie).toHaveBeenCalledWith("userId", "1", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: { id: 1, username: "test" },
    });
  });

  it("register вызывает register и устанавливает cookie", async () => {
    const user = { id: 2, username: "newUser" };
    (authService.register as any).mockResolvedValue(user);

    await controller.register({ username: "newUser", password: "123" }, res as Response);

    expect(authService.register).toHaveBeenCalledWith("newUser", "123");
    expect(res.cookie).toHaveBeenCalledWith("userId", "2", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: { id: 2, username: "newUser" },
    });
  });

  it("logout очищает cookie и возвращает success", async () => {
    await controller.logout(res as Response);

    expect(res.clearCookie).toHaveBeenCalledWith("userId");
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});