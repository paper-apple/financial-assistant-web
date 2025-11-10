// priceSanitizer.test.ts
import { describe, it, expect, vi } from "vitest";
import { handlePriceChange, sanitizePrice } from "../../utils/sanitizePrice";

describe("sanitizePrice", () => {
  it("удаляет лишние символы и приводит запятую к точке", () => {
    expect(sanitizePrice("12,345руб")).toBe("12.34");
    expect(sanitizePrice("99,99$")).toBe("99.99");
  });

  it("ограничивает длину строки 30 символами", () => {
    const long = "1".repeat(50);
    expect(sanitizePrice(long)).toBe("1111111111");
  });

  it("удаляет ведущие нули", () => {
    expect(sanitizePrice("000123")).toBe("123");
    expect(sanitizePrice("0123")).toBe("123");
    expect(sanitizePrice("00.45")).toBe("0.45");
  });

  it("оставляет максимум два знака после точки", () => {
    expect(sanitizePrice("123.4567")).toBe("123.45");
    expect(sanitizePrice("10.1")).toBe("10.1");
    expect(sanitizePrice("10.")).toBe("10.");
  });

  it("ограничивает целую часть 10 символами", () => {
    expect(sanitizePrice("1234567890123")).toBe("1234567890");
    expect(sanitizePrice("1234567890123.45")).toBe("1234567890.45");
  });

  it("возвращает пустую строку для пустого ввода", () => {
    expect(sanitizePrice("")).toBe("");
  });
});

describe("handlePriceChange", () => {
  it("вызывает setter с очищенным значением", () => {
    const setter = vi.fn();
    handlePriceChange("12,345руб", setter);
    expect(setter).toHaveBeenCalledWith("12.34");
  });
});