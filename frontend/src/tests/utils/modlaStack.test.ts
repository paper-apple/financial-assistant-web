// tests/utils/modalStack.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  addModalToStack,
  removeModalFromStack,
  getTopModalId,
  getModalStack
} from "../..//utils/modalStack";

// Чтобы каждый тест начинал с чистого стека, можем использовать beforeEach + removeModalFromStack
beforeEach(() => {
  const ids = getModalStack();
  ids.forEach(id => removeModalFromStack(id));
});

describe("modalStack utils", () => {
  it("addModalToStack добавляет новый id и возвращает его", () => {
    const id = addModalToStack();
    expect(typeof id).toBe("number");
    expect(getModalStack()).toContain(id);
  });

  it("getTopModalId возвращает последний добавленный id", () => {
    const id1 = addModalToStack();
    const id2 = addModalToStack();
    expect(getTopModalId()).toBe(id2);
    removeModalFromStack(id2);
    expect(getTopModalId()).toBe(id1);
  });

  it("removeModalFromStack удаляет нужный id", () => {
    const id1 = addModalToStack();
    const id2 = addModalToStack();
    removeModalFromStack(id2);
    expect(getModalStack()).toEqual([id1]);
  });

  it("getModalStack возвращает копию массива, а не ссылку", () => {
    const id = addModalToStack();
    const stackCopy = getModalStack();
    stackCopy.push(999); // изменяем копию
    expect(getModalStack()).toEqual([id]); // оригинал не изменился
  });

  it("getTopModalId возвращает null, если стек пуст", () => {
    expect(getTopModalId()).toBeNull();
  });
});
