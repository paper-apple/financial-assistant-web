// useFilterFormValidation.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFilterFormValidation } from "../../hooks/useFilterFormValidation";

describe("useFilterFormValidation", () => {
  const validForm = {
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-01-10"),
    minPrice: "10",
    maxPrice: "20",
  };

  it("не устанавливает ошибок для валидной формы", () => {
    const { result } = renderHook(() =>
      useFilterFormValidation(validForm)
    );

    expect(result.current.dateError).toBe(false);
    expect(result.current.priceError).toBe(false);
    expect(result.current.isValid()).toBe(true);
  });

  it("устанавливает priceError, если minPrice > maxPrice", () => {
    const { result } = renderHook(() =>
      useFilterFormValidation({
        ...validForm,
        minPrice: "30",
        maxPrice: "20",
      })
    );

    expect(result.current.priceError).toBe(true);
    expect(result.current.isValid()).toBe(false);
  });

  it("устанавливает dateError, если startDate > endDate", () => {
    const { result } = renderHook(() =>
      useFilterFormValidation({
        ...validForm,
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-01-01"),
      })
    );

    expect(result.current.dateError).toBe(true);
    expect(result.current.isValid()).toBe(false);
  });

  it("validateAndSubmit вызывает onValid, если форма валидна", () => {
    const { result } = renderHook(() =>
      useFilterFormValidation(validForm)
    );
    const onValid = vi.fn();

    act(() => {
      result.current.validateAndSubmit(onValid);
    });

    expect(onValid).toHaveBeenCalled();
  });

  it("validateAndSubmit не вызывает onValid, если форма невалидна", () => {
    const { result } = renderHook(() =>
      useFilterFormValidation({
        ...validForm,
        minPrice: "50",
        maxPrice: "10",
      })
    );
    const onValid = vi.fn();

    act(() => {
      result.current.validateAndSubmit(onValid);
    });

    expect(onValid).not.toHaveBeenCalled();
  });
});
