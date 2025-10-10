// useLongPress.test.ts
import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLongPress } from "../../hooks/useLongPress";

describe("useLongPress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("вызывает onLongPress после задержки", () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPress, delay: 500 }));

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(499);
    });
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it("cancel предотвращает вызов onLongPress", () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPress }));

    act(() => {
      result.current.start();
      result.current.cancel();
      vi.runAllTimers();
    });

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it("move предотвращает вызов onLongPress", () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPress }));

    act(() => {
      result.current.start();
      result.current.move(); // имитация движения
      vi.runAllTimers();
    });

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it("wasLongPress возвращает true только один раз", () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPress, delay: 300 }));

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(300);
    });

    expect(onLongPress).toHaveBeenCalled();

    // первый вызов — true
    expect(result.current.wasLongPress()).toBe(true);
    // второй вызов — уже false
    expect(result.current.wasLongPress()).toBe(false);
  });

  it("учитывает кастомный delay", () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPress, delay: 1000 }));

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(999);
    });
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
