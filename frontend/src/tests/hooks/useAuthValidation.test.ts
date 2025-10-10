// useAuthValidation.test.ts
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAuthValidation } from "../../hooks/useAuthValidation";

describe("useAuthValidation", () => {
  it("validateUsername возвращает ошибку, если имя слишком короткое", () => {
    const { result } = renderHook(() => useAuthValidation());

    expect(result.current.validateUsername("")).toBe(
      "Имя пользователя должно быть длиннее одного символа"
    );
    expect(result.current.validateUsername("a")).toBe(
      "Имя пользователя должно быть длиннее одного символа"
    );
  });

  it("validateUsername возвращает пустую строку для корректного имени", () => {
    const { result } = renderHook(() => useAuthValidation());

    expect(result.current.validateUsername("ab")).toBe("");
    expect(result.current.validateUsername("dima")).toBe("");
  });

  it("validatePassword проверяет минимальную длину", () => {
    const { result } = renderHook(() => useAuthValidation());

    expect(result.current.validatePassword("Ab1")).toBe(
      "Пароль должен содержать минимум 6 символов"
    );
  });

  it("validatePassword проверяет наличие заглавной буквы", () => {
    const { result } = renderHook(() => useAuthValidation());

    expect(result.current.validatePassword("abcdef1")).toBe(
      "Пароль должен содержать хотя бы одну заглавную букву"
    );
  });

  it("validatePassword проверяет наличие строчной буквы", () => {
    const { result } = renderHook(() => useAuthValidation());

    expect(result.current.validatePassword("ABCDEF1")).toBe(
      "Пароль должен содержать хотя бы одну строчную букву"
    );
  });

  it("validatePassword проверяет наличие цифры", () => {
    const { result } = renderHook(() => useAuthValidation());

    expect(result.current.validatePassword("Abcdef")).toBe(
      "Пароль должен содержать хотя бы одну цифру"
    );
  });

  it("validatePassword возвращает пустую строку для корректного пароля", () => {
    const { result } = renderHook(() => useAuthValidation());

    expect(result.current.validatePassword("Abcdef1")).toBe("");
  });

  it("isValid возвращает true только если имя и пароль корректны", () => {
    const { result } = renderHook(() => useAuthValidation());

    expect(result.current.isValid("a", "Abcdef1")).toBe(false); // имя слишком короткое
    expect(result.current.isValid("dima", "abc")).toBe(false); // пароль слишком короткий
    expect(result.current.isValid("dima", "Abcdef1")).toBe(true); // всё ок
  });
});
