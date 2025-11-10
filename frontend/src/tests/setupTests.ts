// setupTests.ts
import "@testing-library/jest-dom";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;

Object.defineProperty(global, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});