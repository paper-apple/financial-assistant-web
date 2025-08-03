import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {ExpenseForm} from "../components/ExpenseForm";

describe("AddExpenseForm", () => {
  it("показывает ошибку, если title пустой и нажать 'Добавить'", () => {
    // рендерим форму
    render(<ExpenseForm />);

    // находим кнопку и кликаем
    const addButton = screen.getByRole("button", { name: /добавить/i });
    fireEvent.click(addButton);

    // ожидаем увидеть текст ошибки под полем
    const errorText = screen.getByText(/заполните поля/i);
    expect(errorText).toBeInTheDocument();
  });

  it("не показывает ошибку, если все поля заполнены", () => {
    render(<ExpenseForm />);

    // вводим текст
    const titleInput = screen.getByPlaceholderText("Название");
    const categoryInput = screen.getByPlaceholderText("Категория");
    const priceInput = screen.getByPlaceholderText("Сумма");
    const placeInput = screen.getByPlaceholderText("Место");

    fireEvent.change(titleInput, { target: { value: "Кофе" } });
    fireEvent.change(categoryInput, { target: { value: "Еда" } });
    fireEvent.change(priceInput, { target: { value: "5.5" } });
    fireEvent.change(placeInput, { target: { value: "Копеечка" } });

    // кликаем добавить
    const addButton = screen.getByRole("button", { name: /добавить/i });
    fireEvent.click(addButton);

    // ошибки не должно быть
    expect(screen.queryByText(/заполните поля/i)).toBeNull();
  });
});
