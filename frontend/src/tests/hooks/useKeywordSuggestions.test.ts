// useKeywordSuggestions.test.ts
import { renderHook, act, waitFor } from "@testing-library/react";
import * as api from "../../api";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useKeywordSuggestions } from "../../hooks/useKeywordSuggestions";

// Мокаем debounce: он сразу вызывает функцию без задержки
vi.mock("lodash.debounce", () => ({
  default: (fn: any) => fn,
}));

// Мокаем API
vi.mock("../../api", () => ({
  suggestKeywords: vi.fn(),
}));

describe("useKeywordSuggestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("очищает подсказки, если ввод короче 2 символов", async () => {
    const { result, rerender } = renderHook(
      ({ input }) => useKeywordSuggestions({ input, field: "title" }),
      { initialProps: { input: "a" } }
    );

    expect(result.current.suggestions).toEqual([]);

    rerender({ input: "b" });

    expect(result.current.suggestions).toEqual([]);
    expect(api.suggestKeywords).not.toHaveBeenCalled();
  });

  it("вызывает suggestKeywords и сохраняет результат", async () => {
    (api.suggestKeywords as Mock).mockResolvedValueOnce({
      data: ["coffee", "coke"],
    });

    const { result, rerender } = renderHook(
      ({ input }) => useKeywordSuggestions({ input, field: "title" }),
      { initialProps: { input: "" } }
    );

    rerender({ input: "co" });

    await waitFor(() => {
      expect(result.current.suggestions).toEqual(["coffee", "coke"]);
    });

    expect(api.suggestKeywords).toHaveBeenCalledWith("co", "title");
  });

  it("обрабатывает ошибку API без падения", async () => {
    (api.suggestKeywords as Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result, rerender } = renderHook(
      ({ input }) => useKeywordSuggestions({ input, field: "category" }),
      { initialProps: { input: "" } }
    );

    rerender({ input: "dr" });

    await waitFor(() => {
      expect(result.current.suggestions).toEqual([]);
    });
  });

  it("clearSuggestions очищает подсказки", async () => {
    (api.suggestKeywords as Mock).mockResolvedValueOnce({
      data: ["milk"],
    });

    const { result, rerender } = renderHook(
      ({ input }) => useKeywordSuggestions({ input, field: "location" }),
      { initialProps: { input: "" } }
    );

    rerender({ input: "mi" });

    await waitFor(() => {
      expect(result.current.suggestions).toEqual(["milk"]);
    });

    act(() => {
      result.current.clearSuggestions();
    });

    expect(result.current.suggestions).toEqual([]);
  });
});
