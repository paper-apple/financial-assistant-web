// // src/tests/components/ExpenseForm.test.tsx
// import { describe, it, expect, vi } from "vitest";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { ExpenseForm } from "../../../components/ExpenseForm";
// import type { Expense, FormState } from "../../../types";
// import * as api from "../../../api";

// // Моковые функции для пропсов
// const mockUpdateField = vi.fn();
// const mockOnOpen = vi.fn();
// const mockOnCreated = vi.fn();
// const mockOnUpdated = vi.fn();

// // Базовое состояние формы
// const baseForm: FormState = {
//   title: "",
//   category: "",
//   price: "",
//   location: "",
//   datetime: new Date().toISOString(),
// };

// const mockResolvedValueData: Expense = {
//   id: 1, 
//   title: "Тест",
//   category: "Категория",
//   price: 10,
//   location: "Место",
//   datetime: new Date().toISOString(),
// }

// describe("ExpenseForm", () => {
//   // Рендер компонента с кастомными параметрами формы
//   const renderForm = (formOverrides: Partial<FormState> = {}) => {
//     const form = { ...baseForm, ...formOverrides };
    
//     render(
//       <ExpenseForm
//         form={form}
//         updateField={mockUpdateField}
//         onCalendarOpen={mockOnOpen}
//         onCreated={mockOnCreated}
//         onUpdated={mockOnUpdated}
//       />
//     );
//   };

//   it("вызывает onCreated при успешном создании", async () => {
//     vi.spyOn(api, 'createExpense').mockResolvedValue(mockResolvedValueData);    
//     renderForm({
//       title: "Тест",
//       category: "Категория",
//       price: "10",
//       location: "Место"
//     });

//     await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
//     expect(mockOnCreated).toHaveBeenCalled();
//   });

//   it("вызывает onUpdated при успешном обновлении", async () => {
//     const existingExpense: Expense = {
//       id: 42,
//       title: "Старое название",
//       category: "Категория",
//       price: 10,
//       location: "Место",
//       datetime: new Date().toISOString()
//     };

//     vi.spyOn(api, 'updateExpense').mockResolvedValue(mockResolvedValueData);

//     render(
//       <ExpenseForm
//         form={{
//           ...baseForm,
//           title: "Новое название",
//           category: "Категория",
//           price: "15",
//           location: "Место"
//         }}
//         updateField={mockUpdateField}
//         onCalendarOpen={mockOnOpen}
//         onCreated={mockOnCreated}
//         onUpdated={mockOnUpdated}
//         initialData={existingExpense}
//       />
//     );

//     await userEvent.click(screen.getByRole("button", { name: /сохранить/i }));
//     expect(mockOnUpdated).toHaveBeenCalledWith(mockResolvedValueData);
//   });

//   it("не закрывает форму при ошибке API", async () => {
//   // Мокируем API чтобы возвращать ошибку
//     vi.spyOn(api, "createExpense").mockRejectedValue(new Error("API Error"));
    
//     renderForm({
//       title: "Тест",
//       category: "Категория",
//       price: "10",
//       location: "Место"
//     });

//     await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
//     expect(screen.getByPlaceholderText("Название")).toBeInTheDocument();
//   });

//   it("показывает ошибку, если поле 'Название' пустое", async () => {
//     renderForm({
//       category: "Еда",
//       price: "5.5",
//       location: "Кафе"
//     });

//     await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
//     expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
//   });

//   it("показывает ошибку, если поле 'Категория' пустое", async () => {
//     renderForm({
//       title: "Кофе",
//       price: "5.5",
//       location: "Кафе"
//     });

//     await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
//     expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
//   });

//   it("показывает ошибку, если поле 'Сумма' пустое", async () => {
//     renderForm({
//       title: "Кофе",
//       category: "Еда",
//       location: "Кафе"
//     });

//     await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
//     expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
//   });

//   it("показывает ошибку, если поле 'Место' пустое", async () => {
//     renderForm({
//       title: "Кофе",
//       category: "Еда",
//       price: "5.5",
//     });

//     await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
//     expect(screen.getByText(/заполните поля/i)).toBeInTheDocument();
//   });

//   it("не показывает ошибку, если все поля заполнены", async () => {
//     renderForm({
//       title: "Кофе",
//       category: "Еда",
//       price: "5.5",
//       location: "Кафе",
//     });

//     await userEvent.click(screen.getByRole("button", { name: /добавить/i }));
//     expect(screen.queryByText(/заполните поля/i)).toBeNull();
//   });

//   it("корректно вызывает updateField при изменении полей", async () => {
//     renderForm();
    
//     const titleInput = screen.getByPlaceholderText("Название");
//     await userEvent.type(titleInput, "Тест");
//     expect(mockUpdateField).toHaveBeenCalledWith("title", "Т");
//     expect(mockUpdateField).toHaveBeenCalledWith("title", "е");
//     expect(mockUpdateField).toHaveBeenCalledWith("title", "с");
//     expect(mockUpdateField).toHaveBeenCalledWith("title", "т");
//   });

//   it("нормализует ввод цены", async () => {
//     renderForm();
//     mockUpdateField.mockClear(); // Очищаем вызовы от рендера
    
//     const priceInput = screen.getByPlaceholderText("Сумма");
//     await userEvent.type(priceInput, "1,23a");
    
//     // Проверяем что вызовы были с нормализованными значениями
//     expect(mockUpdateField).toHaveBeenCalledWith("price", "1");
//     expect(mockUpdateField).toHaveBeenCalledWith("price", "2");
//     expect(mockUpdateField).toHaveBeenCalledWith("price", ".");
//     expect(mockUpdateField).toHaveBeenCalledWith("price", "3");
//     expect(mockUpdateField).toHaveBeenCalledWith("price", "");
//   });

//   it("вызывает onOpen при клике на кнопку даты", async () => {
//     renderForm();
//     await userEvent.click(screen.getByTestId("calendar-button"));
//     expect(mockOnOpen).toHaveBeenCalled();
//   });
// });


// src/components/__tests__/ExpenseForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExpenseForm } from "../../../components/ExpenseForm";
import type { Expense, FormState } from '../../../types';

// Мокаем API вызовы
vi.mock('../../../api', () => ({
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
}));

// Мокаем кастомные хуки
vi.mock('../../../hooks/useKeywordSuggestions', () => ({
  useKeywordSuggestions: vi.fn(() => ({
    suggestions: [],
    clearSuggestions: vi.fn(),
  })),
}));

vi.mock('../../../hooks/useExpenseFormValidation', () => ({
  useExpenseFormValidation: vi.fn(() => ({
    getFieldError: vi.fn(() => false),
    validateAndSubmit: vi.fn((callback) => callback()),
    isValid: vi.fn(() => true),
    wasSubmitted: false,
  })),
}));

// Мокаем FormField компонент
vi.mock('../../ui/FormField', () => ({
  FormField: vi.fn(({ label, name, value, onChange, placeholder }) => (
    <div data-testid={`form-field-${name}`}>
      <label>{label}</label>
      <input
        data-testid={`input-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )),
}));

// Импортируем после моков
import { createExpense, updateExpense } from '../../../api';

const mockForm: FormState = {
  title: 'Test Expense',
  category: 'Food',
  price: '100.50',
  location: 'Supermarket',
  datetime: '2024-01-01T12:00:00Z',
};

const mockExpense: Expense = {
  id: 1,
  title: 'Test Expense',
  category: { id: 1, name: 'Food' },
  price: 100.50,
  location: { id: 1, name: 'Supermarket' },
  datetime: '2024-01-01T12:00:00Z',
};

describe('ExpenseForm', () => {
  const mockUpdateField = vi.fn();
  const mockOnCreated = vi.fn();
  const mockOnUpdated = vi.fn();
  const mockOnCalendarOpen = vi.fn();
  const mockOnModalClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createExpense).mockResolvedValue(mockExpense);
    vi.mocked(updateExpense).mockResolvedValue(mockExpense);
  });

  it('рендерит все поля формы', () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    expect(screen.getByTestId('form-field-title')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-category')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-price')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-location')).toBeInTheDocument();
  });

  it('отображает кнопку даты с правильным текстом', () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    const dateButton = screen.getByText('01.01.2024, 12:00');
    expect(dateButton).toBeInTheDocument();
  });

  it('отображает placeholder для даты когда datetime пустой', () => {
    const emptyForm = { ...mockForm, datetime: '' };
    
    render(
      <ExpenseForm
        form={emptyForm}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    expect(screen.getByText('Выберите дату и время')).toBeInTheDocument();
  });

  it('вызывает onCalendarOpen при клике на кнопку даты', () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    const dateButton = screen.getByText('01.01.2024, 12:00');
    fireEvent.click(dateButton);

    expect(mockOnCalendarOpen).toHaveBeenCalledTimes(1);
  });

  it('вызывает onModalClose при клике на кнопку "Отменить"', () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    const cancelButton = screen.getByText('Отменить');
    fireEvent.click(cancelButton);

    expect(mockOnModalClose).toHaveBeenCalledTimes(1);
  });

  it('создает новый расход при сабмите без initialData', async () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
        onCreated={mockOnCreated}
      />
    );

    const submitButton = screen.getByText('Применить');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createExpense).toHaveBeenCalledWith({
        ...mockForm,
        price: 100.50, // Преобразованная цена
      });
      expect(mockOnCreated).toHaveBeenCalledWith(mockExpense);
    });
  });

  it('обновляет существующий расход при сабмите с initialData', async () => {
    render(
      <ExpenseForm
        form={mockForm}
        initialData={mockExpense}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
        onUpdated={mockOnUpdated}
      />
    );

    const submitButton = screen.getByText('Применить');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateExpense).toHaveBeenCalledWith(1, {
        ...mockForm,
        price: 100.50,
      });
      expect(mockOnUpdated).toHaveBeenCalledWith(mockExpense);
    });
  });

  it('обрабатывает изменения полей формы', () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    const titleInput = screen.getByTestId('input-title');
    fireEvent.change(titleInput, { target: { name: 'title', value: 'New Title' } });

    expect(mockUpdateField).toHaveBeenCalledWith('title', 'New Title');
  });

  it('обрабатывает ошибки при сохранении', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(createExpense).mockRejectedValue(new Error('API Error'));

    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onCalendarOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
        onCreated={mockOnCreated}
      />
    );

    const submitButton = screen.getByText('Применить');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Ошибка при сохранении:', expect.any(Error));
      expect(mockOnCreated).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});