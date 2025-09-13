// utils/priceSanitizer.ts

/**
 * Очищает строку цены от лишних символов, приводит к формату с максимум двумя знаками после точки.
 * Пример: "12,345руб" → "12.34"
 */

export function handlePriceChange(value: string, setter: (v: string) => void) {
  setter(sanitizePriceInput(value));
}

export function sanitizePriceInput(value: string): string {
  return value
    .replace(/[^\d.,]/g, "")       // Удаляет всё, кроме цифр, точки и запятой
    .replace(",", ".")             // Заменяет запятую на точку
    .replace(/^(\d*\.\d{0,2}).*$/, "$1"); // Ограничивает до двух знаков после точки
}
