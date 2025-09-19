// utils/priceSanitizer.ts

/**
 * Очищает строку цены от лишних символов, приводит к формату с максимум двумя знаками после точки.
 * Пример: "12,345руб" → "12.34"
 */

export function handlePriceChange(value: string, setter: (v: string) => void) {
  setter(sanitizePrice(value));
}

export function sanitizePrice(value: string): string {
  let sanitizedValue = value.slice(0, 30);
    sanitizedValue = value
    .replace(/[^\d.,]/g, "")
    .replace(",", ".")
    .replace(/^(\d*\.\d{0,2}).*$/, "$1");

  const [integerPart, decimalPart] = sanitizedValue.split(".");
  if (integerPart.length > 10) {
    sanitizedValue =
      integerPart.slice(0, 10) +
      (decimalPart !== undefined ? "." + decimalPart : "");
  }
  return sanitizedValue
}
