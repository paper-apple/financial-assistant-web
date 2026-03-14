// SuggestionList.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { SuggestionsList } from "../../../components/ui/SuggestionList";

describe("SuggestionsList", () => {
  const onSelect = vi.fn();
  const list = ["apple", "banana", "cherry"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендер всех элементов списка", () => {
    render(
      <SuggestionsList
        list={list}
        onSelect={onSelect}
        highlightedIndex={-1}
        isOpen={true}
      />
    );
    expect(screen.getByText("apple")).toBeInTheDocument();
    expect(screen.getByText("banana")).toBeInTheDocument();
    expect(screen.getByText("cherry")).toBeInTheDocument();
  });

  it("применение класса bg-blue-100 к выделенному элементу", () => {
    render(
      <SuggestionsList
        list={list}
        onSelect={onSelect}
        highlightedIndex={1}
        isOpen={true}
      />
    );
    const banana = screen.getByText("banana");
    expect(banana).toHaveClass("bg-blue-100");
  });

  it("вызов onSelect при клике на элемент", async () => {
    render(
      <SuggestionsList
        list={list}
        onSelect={onSelect}
        highlightedIndex={-1}
        isOpen={true}
      />
    );
    const cherry = screen.getByText("cherry");
    await userEvent.click(cherry);
    expect(onSelect).toHaveBeenCalledWith("cherry");
  });

  it("скрытие списка, если isOpen=false", () => {
    const { container } = render(
      <SuggestionsList
        list={list}
        onSelect={onSelect}
        highlightedIndex={-1}
        isOpen={false}
      />
    );
    expect(container.firstChild).toHaveClass("max-h-0", "opacity-0");
  });

  it("открытие список, если isOpen=true", () => {
    const { container } = render(
      <SuggestionsList
        list={list}
        onSelect={onSelect}
        highlightedIndex={-1}
        isOpen={true}
      />
    );
    expect(container.firstChild).toHaveClass("max-h-32", "opacity-100");
  });
});