// src/tests/components/ExpenseForm.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpenseForm } from "../../../components/ExpenseForm";
import type { Expense, FormState } from "../../../types";
import * as api from "../../../api";

// Моковые функции для пропсов
const mockUpdateField = vi.fn();
const mockOnOpen = vi.fn();
const mockOnCreated = vi.fn();
const mockOnUpdated = vi.fn();

// Базовое состояние формы
const baseForm: FormState = {
  title: "",
  category: "",
  price: "",
  location: "",
  datetime: new Date().toISOString(),
};

const mockResolvedValueData: Expense = {
  id: 1, 
  title: "Тест",
  category: "Категория",
  price: 10,
  location: "Место",
  datetime: new Date().toISOString(),
}

describe("ExpenseForm", () => {
  // Рендер компонента с кастомными параметрами формы
  const renderForm = (formOverrides: Partial<FormState> = {}) => {
    const form = { ...baseForm, ...formOverrides };
    
    render(
      <ExpenseForm
        form={form}
        updateField={mockUpdateField}
        onOpen={mockOnOpen}
        onCreated={mockOnCreated}
        onUpdated={mockOnUpdated}
      />
    );
  };

  it("вызывает onCreated при успешном создании", async () => {
    vi.spyOn(api, 'createExpense').mockResolvedValue(mockResolvedValueData);    
    renderForm({
      title: "Тест",
      category: "Категория",
      price: "10",
      location: "Место"
    });

    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
    expect(mockOnCreated).toHaveBeenCalled();
  });

  it("вызывает onUpdated при успешном обновлении", async () => {
    const existingExpense: Expense = {
      id: 42,
      title: "Старое название",
      category: "Категория",
      price: 10,
      location: "Место",
      datetime: new Date().toISOString()
    };

    vi.spyOn(api, 'updateExpense').mockResolvedValue(mockResolvedValueData);

    render(
      <ExpenseForm
        form={{
          ...baseForm,
          title: "Новое название",
          category: "Категория",
          price: "15",
          location: "Место"
        }}
        updateField={mockUpdateField}
        onOpen={mockOnOpen}
        onCreated={mockOnCreated}
        onUpdated={mockOnUpdated}
        initialData={existingExpense}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /сохранить/i }));
    expect(mockOnUpdated).toHaveBeenCalledWith(mockResolvedValueData);
  });

  it("не закрывает форму при ошибке API", async () => {
  // Мокируем API чтобы возвращать ошибку
    vi.spyOn(api, "createExpense").mockRejectedValue(new Error("API Error"));
    
    renderForm({
      title: "Тест",
      category: "Категория",
      price: "10",
      location: "Место"
    });

    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
    expect(screen.getByPlaceholderText("Название")).toBeInTheDocument();
  });

  it("показывает ошибку, если поле 'Название' пустое", async () => {
    renderForm({
      category: "Еда",
      price: "5.5",
      location: "Кафе"
    });

    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
    expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
  });

  it("показывает ошибку, если поле 'Категория' пустое", async () => {
    renderForm({
      title: "Кофе",
      price: "5.5",
      location: "Кафе"
    });

    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
    expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
  });

  it("показывает ошибку, если поле 'Сумма' пустое", async () => {
    renderForm({
      title: "Кофе",
      category: "Еда",
      location: "Кафе"
    });

    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
    expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
  });

  it("показывает ошибку, если поле 'Место' пустое", async () => {
    renderForm({
      title: "Кофе",
      category: "Еда",
      price: "5.5",
    });

    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
    expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
  });

  it("не показывает ошибку, если все поля заполнены", async () => {
    renderForm({
      title: "Кофе",
      category: "Еда",
      price: "5.5",
      location: "Кафе",
    });

    await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
    expect(screen.queryByText(/заполните поля/i)).toBeNull();
  });

  it("корректно вызывает updateField при изменении полей", async () => {
    renderForm();
    
    const titleInput = screen.getByPlaceholderText("Название");
    await userEvent.type(titleInput, "Тест");
    expect(mockUpdateField).toHaveBeenCalledWith("title", "Т");
    expect(mockUpdateField).toHaveBeenCalledWith("title", "е");
    expect(mockUpdateField).toHaveBeenCalledWith("title", "с");
    expect(mockUpdateField).toHaveBeenCalledWith("title", "т");
  });

  it("нормализует ввод цены", async () => {
    renderForm();
    mockUpdateField.mockClear(); // Очищаем вызовы от рендера
    
    const priceInput = screen.getByPlaceholderText("Сумма");
    await userEvent.type(priceInput, "1,23a");
    
    // Проверяем что вызовы были с нормализованными значениями
    expect(mockUpdateField).toHaveBeenCalledWith("price", "1");
    expect(mockUpdateField).toHaveBeenCalledWith("price", "2");
    expect(mockUpdateField).toHaveBeenCalledWith("price", ".");
    expect(mockUpdateField).toHaveBeenCalledWith("price", "3");
    expect(mockUpdateField).toHaveBeenCalledWith("price", "");
  });

  it("вызывает onOpen при клике на кнопку даты", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("calendar-button"));
    expect(mockOnOpen).toHaveBeenCalled();
  });
});