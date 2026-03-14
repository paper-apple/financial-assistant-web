// useBodyScrollLock.test.ts
import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { describe, beforeEach, test, expect } from 'vitest';

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    document.documentElement.className = '';
  });

  test('добавление класса hide-scrollbar, если контент выше окна', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    });

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });

    renderHook(() => useBodyScrollLock());

    expect(document.documentElement.classList.contains('hide-scrollbar')).toBe(true);
  });

  test('удаление класса hide-scrollbar при размонтировании', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    });

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });

    const { unmount } = renderHook(() => useBodyScrollLock());

    expect(document.documentElement.classList.contains('hide-scrollbar')).toBe(true);

    unmount();

    expect(document.documentElement.classList.contains('hide-scrollbar')).toBe(false);
  });
});
