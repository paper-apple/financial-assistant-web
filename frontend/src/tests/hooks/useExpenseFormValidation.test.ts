// useExpenseFormValidation.test.ts
import { renderHook, act } from "@testing-library/react";
import type { FormState } from "../../types";
import { describe, expect, it, vi } from "vitest";
import { useExpenseFormValidation } from "../../hooks/useExpenseFormValidation";

describe("useExpenseFormValidation", () => {
  const validForm: FormState = {
    title: "Lunch",
    category: "Food",
    price: "10",
    location: "Cafe",
    datetime: "01.01.2025, 12:00"
  };

  const invalidForm: FormState = {
    title: "",
    category: "",
    price: "",
    location: "",
    datetime: ""
  };

  it("isValid возвращает true для корректной формы", () => {
    const { result } = renderHook(() =>
      useExpenseFormValidation(validForm)
    );

    expect(result.current.isValid()).toBeTruthy();
  });

  it("isValid возвращает false для пустой формы", () => {
    const { result } = renderHook(() =>
      useExpenseFormValidation(invalidForm)
    );

    expect(result.current.isValid()).toBeFalsy();
  });

  it("getFieldError возвращает false до сабмита", () => {
    const { result } = renderHook(() =>
      useExpenseFormValidation(invalidForm)
    );

    expect(result.current.getFieldError("title")).toBe(false);
  });

  it("getFieldError возвращает true после сабмита, если поле пустое", () => {
    const { result } = renderHook(() =>
      useExpenseFormValidation(invalidForm)
    );

    act(() => {
      result.current.setWasSubmitted(true);
    });

    expect(result.current.getFieldError("title")).toBe(true);
    expect(result.current.getFieldError("category")).toBe(true);
  });

  it("getFieldError возвращает false после сабмита, если поле заполнено", () => {
    const { result } = renderHook(() =>
      useExpenseFormValidation(validForm)
    );

    act(() => {
      result.current.setWasSubmitted(true);
    });

    expect(result.current.getFieldError("title")).toBe(false);
    expect(result.current.getFieldError("category")).toBe(false);
  });

  it("validateAndSubmit вызывает onValid, если форма валидна", () => {
    const { result } = renderHook(() =>
      useExpenseFormValidation(validForm)
    );
    const onValid = vi.fn();

    act(() => {
      result.current.validateAndSubmit(onValid);
    });

    expect(result.current.wasSubmitted).toBe(true);
    expect(onValid).toHaveBeenCalled();
  });

  it("validateAndSubmit не вызывает onValid, если форма невалидна", () => {
    const { result } = renderHook(() =>
      useExpenseFormValidation(invalidForm)
    );
    const onValid = vi.fn();

    act(() => {
      result.current.validateAndSubmit(onValid);
    });

    expect(result.current.wasSubmitted).toBe(true);
    expect(onValid).not.toHaveBeenCalled();
  });
});
