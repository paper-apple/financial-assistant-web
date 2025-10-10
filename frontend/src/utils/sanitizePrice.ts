// utils/priceSanitizer.ts
// Очищает строку цены от лишних символов, приводит к формату с максимум двумя знаками после точки
export function handlePriceChange(value: string, setter: (v: string) => void) {
  setter(sanitizePrice(value));
}

export function sanitizePrice(value: string): string {
  let sanitizedValue = value
    .replace(/[^\d.,]/g, "")
    .replace(",", ".");

  // Удаление ведущих нулей, кроме случая "0" или "0.12"
  sanitizedValue = sanitizedValue.replace(/^0{2,}/, "0"); // → "00" → "0"
  sanitizedValue = sanitizedValue.replace(/^0+(\d)/, "$1"); // → "012" → "12"

  // Ограничиваем до двух знаков после точки
  sanitizedValue = sanitizedValue.replace(/^(\d*\.\d{0,2}).*$/, "$1");

  const [integerPart, decimalPart] = sanitizedValue.split(".");
  if (integerPart.length > 10) {
    sanitizedValue =
      integerPart.slice(0, 10) +
      (decimalPart !== undefined ? "." + decimalPart : "");
  }

  return sanitizedValue;
}
