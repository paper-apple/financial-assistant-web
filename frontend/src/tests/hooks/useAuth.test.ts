// useAuth.test.ts
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "../../hooks/useAuth";
import { login, register, logout, fetchExpenses } from "../../api";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("../../api", () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  fetchExpenses: vi.fn(),
}));

describe("useAuth", () => {
  beforeEach(() => {
      vi.clearAllMocks();
    });
    
    afterEach(() => {
      vi.restoreAllMocks();
    });

  it("устанавливка user при успешном запросе", async () => {
    (fetchExpenses as Mock).mockResolvedValueOnce({
      data: [{ user: { username: "dima" } }],
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.checkAuth();
    });

    expect(result.current.user).toEqual({ username: "dima" });
    expect(result.current.authModalOpen).toBe(false);
  });

  it("открытие модального окна при ошибке", async () => {
    (fetchExpenses as Mock).mockRejectedValueOnce(new Error("fail"));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.checkAuth();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.authModalOpen).toBe(true);
  });

  it("loginUser устанавливает user при успехе", async () => {
    (login as Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.loginUser("dima", "123");
    });

    expect(result.current.user).toEqual({ username: "dima" });
    expect(result.current.authError).toBe(null);
  });

  it("loginUser устанавливает error при ошибке", async () => {    
    (login as Mock).mockRejectedValueOnce({
      response: { 
      data: { message: "Неверный пароль" } 
      }
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.authError).toBe(null);

    let caughtError;
    await act(async () => {
      try {
        await result.current.loginUser("dima", "wrong");
      } catch (err) {
        caughtError = err;
      }
    });

    expect(caughtError).toBeDefined();

    await waitFor(() => {
      expect(result.current.authError).toBe("Неверный пароль");
    });

    expect(result.current.user).toBeNull();
  });

  it("registerUser устанавливает user при успехе", async () => {
    (register as Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.registerUser("newuser", "123");
    });

    expect(result.current.user).toEqual({ username: "newuser" });
  });

  it("registerUser устанавливает error при ошибке", async () => {
    (register as Mock).mockRejectedValueOnce({
      response: { data: { message: "Имя занято" } },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.registerUser("newuser", "123"))
        .rejects.toBeDefined();
    });

    await waitFor(() => {
      expect(result.current.authError).toBe("Имя занято");
      expect(result.current.user).toBeNull();
    });
  });

  it("logoutUser очищает user", async () => {
    (logout as Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.setUser?.({ username: "dima" });
    });

    await act(async () => {
      await result.current.logoutUser();
    });

    expect(result.current.user).toBeNull();
  });
});
