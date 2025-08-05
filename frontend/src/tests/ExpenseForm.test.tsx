import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {ExpenseForm} from "../components/ExpenseForm";

describe("AddExpenseForm", () => {
  it("показывает ошибку, если title пустой и нажать 'Добавить'", async () => {
    // рендерим форму
    render(<ExpenseForm />);

    // находим кнопку и кликаем
    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));

    // ожидаем увидеть текст ошибки под полем
    const errorText = screen.getByText(/заполните поля/i);
    expect(errorText).toBeInTheDocument();
  });

  it("не показывает ошибку, если все поля заполнены", async () => {
    render(<ExpenseForm />);

    // вводим текст
    const titleInput = screen.getByPlaceholderText("Название");
    const categoryInput = screen.getByPlaceholderText("Категория");
    const priceInput = screen.getByPlaceholderText("Сумма");
    const placeInput = screen.getByPlaceholderText("Место");

    // fireEvent.change(titleInput, { target: { value: "Кофе" } });
    await userEvent.type(titleInput, "Кофе");
    await userEvent.type(categoryInput, "Еда");
    await userEvent.type(priceInput, "5.5");
    await userEvent.type(placeInput, "Копеечка");

    // кликаем добавить
    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));

    // ошибки не должно быть
    expect(screen.queryByText(/заполните поля/i)).toBeNull();
  });
});
