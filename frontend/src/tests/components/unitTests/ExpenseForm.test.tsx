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
        onModalOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    expect(screen.getByTestId('input-title')).toBeInTheDocument();
    expect(screen.getByTestId('input-category')).toBeInTheDocument();
    expect(screen.getByTestId('input-price')).toBeInTheDocument();
    expect(screen.getByTestId('input-location')).toBeInTheDocument();
  });

  it('отображает кнопку даты с правильным текстом', () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onModalOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    const dateButton = screen.getByTestId('button-date')

    expect(dateButton).toBeInTheDocument();
  });

  it('вызывает onCalendarOpen при клике на кнопку даты', () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onModalOpen={mockOnCalendarOpen}
        onModalClose={mockOnModalClose}
      />
    );

    const dateButton = screen.getByTestId('button-date')

    fireEvent.click(dateButton);

    expect(mockOnCalendarOpen).toHaveBeenCalledTimes(1);
  });

  it('вызывает onModalClose при клике на кнопку "Отменить"', () => {
    render(
      <ExpenseForm
        form={mockForm}
        updateField={mockUpdateField}
        onModalOpen={mockOnCalendarOpen}
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
        onModalOpen={mockOnCalendarOpen}
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
        onModalOpen={mockOnCalendarOpen}
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
        onModalOpen={mockOnCalendarOpen}
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
        onModalOpen={mockOnCalendarOpen}
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