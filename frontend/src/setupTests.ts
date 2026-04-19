// setupTests.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('./hooks/useTranslation.ts', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('./context/SettingsContext.tsx', () => ({
  useSettings: () => ({
    language: 'ru',
    setLanguage: vi.fn(),
  }),
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
