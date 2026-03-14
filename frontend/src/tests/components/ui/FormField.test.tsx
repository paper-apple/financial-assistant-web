// FormField.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { FormField } from "../../../components/ui/FormField";

describe("FormField", () => {
  const onChange = vi.fn();
  const onSuggestionSelect = vi.fn();
  const onClear = vi.fn();
  const onFieldClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендер label и placeholder", () => {
    render(<FormField label="Имя" value="" placeholder="Введите имя" />);
    expect(screen.getByText("Имя")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Введите имя")).toBeInTheDocument();
  });

  it("вызов onChange при вводе текста", async () => {
    render(<FormField value="" onChange={onChange} testId="field" />);
    const input = screen.getByTestId("field");
    await userEvent.type(input, "abc");
    expect(onChange).toHaveBeenCalled();
  });

  it("отображение кнопки очистки и вызов onClear", async () => {
    render(<FormField value="x" onClear={onClear} />);
    const btn = screen.getByRole("button", { name: "×" });
    await userEvent.click(btn);
    expect(onClear).toHaveBeenCalled();
  });

  it("вызов onFieldClick в режиме readOnly  при клике", async () => {
    render(<FormField value="readonly" readOnly calendarOpen={onFieldClick} />);
    const input = screen.getByDisplayValue("readonly");
    await userEvent.click(input);
    expect(onFieldClick).toHaveBeenCalled();
  });

  it("открытие списка подсказок при фокусе", async () => {
    render(
      <FormField
        value=""
        suggestions={["one", "two"]}
        onSuggestionSelect={onSuggestionSelect}
        testId="field"
      />
    );
    const input = screen.getByTestId("field");
    await userEvent.click(input);
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("при навигации стрелками изменяется highlightedIndex и при нажатии Enter выбирается подсказка", async () => {
    render(
      <FormField
        value=""
        suggestions={["apple", "banana"]}
        onSuggestionSelect={onSuggestionSelect}
        testId="field"
      />
    );
    const input = screen.getByTestId("field");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    expect(onSuggestionSelect).toHaveBeenCalledWith("apple");
  });

  it("циклический выбор последней подсказки при ArrowUp", async () => {
    render(
      <FormField
        value=""
        suggestions={["apple", "banana"]}
        onSuggestionSelect={onSuggestionSelect}
        testId="field"
      />
    );
    const input = screen.getByTestId("field");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");
    await userEvent.keyboard("{Enter}");

    expect(onSuggestionSelect).toHaveBeenCalledWith("banana");
  });
});