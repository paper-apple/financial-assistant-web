// useBodyScrollLock.test.ts
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

describe("useBodyScrollLock", () => {
  beforeEach(() => {
    document.body.style.overflow = "visible";
    document.body.style.paddingRight = "0px";
  });

  afterEach(() => {
    document.body.style.overflow = "visible";
    document.body.style.paddingRight = "0px";
  });

  it("в не-Safari блокирует скролл и добавляет paddingRight", () => {
    const { unmount } = renderHook(() => useBodyScrollLock(false));

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("16px");

    unmount();

    expect(document.body.style.overflow).toBe("visible");
    expect(document.body.style.paddingRight).toBe("0px");
  });

  it("в Safari блокирует скролл, но не меняет paddingRight", () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("0px");

    unmount();

    expect(document.body.style.overflow).toBe("visible");
    expect(document.body.style.paddingRight).toBe("0px");
  });
});