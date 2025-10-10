import "@testing-library/jest-dom";

// Мокаем ResizeObserver для jsdom
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;

// Мокаем методы для DatePicker если используется
Object.defineProperty(global, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});