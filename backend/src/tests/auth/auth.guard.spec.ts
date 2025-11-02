// auth.guard.spec.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { UnauthorizedException, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "../../auth/auth.guard";

describe("AuthGuard", () => {
  let guard: AuthGuard;
  let context: Partial<ExecutionContext>;
  let request: Partial<Request>;

  beforeEach(() => {
    guard = new AuthGuard();

    request = {
      cookies: {},
    };

    context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
    } as unknown as ExecutionContext;

  });

  it("выбрасывает UnauthorizedException, если cookie userId отсутствует", () => {
    request.cookies = {};

    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(
      UnauthorizedException
    );
  });

  it("возвращает true и добавляет userId в request, если cookie userId есть", () => {
    request.cookies = { userId: "42" };

    const result = guard.canActivate(context as ExecutionContext);

    expect(result).toBe(true);
    expect(request["userId"]).toBe(42);
  });
});