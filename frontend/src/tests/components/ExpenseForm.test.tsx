import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {ExpenseForm} from "../../components/ExpenseForm";

describe("AddExpenseForm", () => {
  it.each([
    ["Название", { title: "", category: "Еда", price: "5.5", place: "Кафе" }],
    ["Категория", { title: "Кофе", category: "", price: "5.5", place: "Кафе" }],
    ["Сумма",     { title: "Кофе", category: "Еда", price: "", place: "Кафе" }],
    ["Место",     { title: "Кофе", category: "Еда", price: "5.5", place: "" }],
  ])("показывает ошибку, если поле '%s' пустое", async (_, { title, category, price, place }) => {
    render(<ExpenseForm isOpen={true}/>);

    if (title)     await userEvent.type(screen.getByPlaceholderText("Название"), title);
    if (category)  await userEvent.type(screen.getByPlaceholderText("Категория"), category);
    if (price)     await userEvent.type(screen.getByPlaceholderText("Сумма"), price);
    if (place)     await userEvent.type(screen.getByPlaceholderText("Место"), place);

    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));

    expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
  });

  it("не показывает ошибку, если все поля заполнены", async () => {
    render(<ExpenseForm isOpen={true}/>);

    // вводим текст
    const titleInput = screen.getByPlaceholderText("Название");
    const categoryInput = screen.getByPlaceholderText("Категория");
    const priceInput = screen.getByPlaceholderText("Сумма");
    const placeInput = screen.getByPlaceholderText("Место");

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