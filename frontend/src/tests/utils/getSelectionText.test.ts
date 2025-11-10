// getSelectionText.test.ts
import { describe, it, expect } from "vitest";
import { getSelectionText } from "../../utils/getSelectionText";

describe("getSelectionText", () => {
  describe("confirmDelete = true", () => {
    it("возвращает форму 'запись' для 1", () => {
      expect(getSelectionText(1, true)).toBe("Удалить 1 запись?");
    });

    it("возвращает форму 'записи' для 2, 3, 4", () => {
      expect(getSelectionText(2, true)).toBe("Удалить 2 записи?");
      expect(getSelectionText(3, true)).toBe("Удалить 3 записи?");
      expect(getSelectionText(4, true)).toBe("Удалить 4 записи?");
    });

    it("возвращает форму 'записей' для 5, 11, 20", () => {
      expect(getSelectionText(5, true)).toBe("Удалить 5 записей?");
      expect(getSelectionText(11, true)).toBe("Удалить 11 записей?");
      expect(getSelectionText(20, true)).toBe("Удалить 20 записей?");
    });

    it("корректно работает с числами > 20", () => {
      expect(getSelectionText(21, true)).toBe("Удалить 21 запись?");
      expect(getSelectionText(22, true)).toBe("Удалить 22 записи?");
      expect(getSelectionText(25, true)).toBe("Удалить 25 записей?");
    });
  });

  describe("confirmDelete = false", () => {
    it("использует 'Выбрана' для 1", () => {
      expect(getSelectionText(1, false)).toBe("Выбрана 1 запись");
    });

    it("использует 'Выбрано' для >1", () => {
      expect(getSelectionText(2, false)).toBe("Выбрано 2 записи");
      expect(getSelectionText(5, false)).toBe("Выбрано 5 записей");
    });

    it("использует 'Выбрана' для 1, 21, 31, ... и не для 11", () => {
      expect(getSelectionText(1, false)).toBe("Выбрана 1 запись");
      expect(getSelectionText(21, false)).toBe("Выбрана 21 запись");
      expect(getSelectionText(31, false)).toBe("Выбрана 31 запись");
      expect(getSelectionText(11, false)).toBe("Выбрано 11 записей");
    });

    it("корректно склоняет для чисел > 20", () => {
      expect(getSelectionText(21, false)).toBe("Выбрана 21 запись");
      expect(getSelectionText(22, false)).toBe("Выбрано 22 записи");
      expect(getSelectionText(25, false)).toBe("Выбрано 25 записей");
    });
  });
});