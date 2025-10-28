import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpensesPage } from '../../../components/ExpensesPage';
import * as api from "../../../api";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setupApiMocks } from './setupTestEnv';

describe('Создание расхода', () => {
  const user = userEvent.setup();
  
  beforeEach(() => {
    setupApiMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('новый расход создаётся', async () => {
    const newExpense = {
      id: 3,
      title: 'Билет на "F1"',
      category: 'Кино',
      price: 22,
      location: 'Skyline',
      datetime: '2023-01-03T20:00:00.000Z'
    };
    
    vi.spyOn(api, 'createExpense').mockResolvedValue(newExpense);
    render(<ExpensesPage />);
    
    // Open add modal
    const addButton = screen.getByText('+');
    await user.click(addButton);

    expect(screen.getByText('Добавить расход')).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText('Название')
    const categoryInput = screen.getByPlaceholderText('Категория')
    const priceInput = screen.getByPlaceholderText('Сумма')
    const locationInput = screen.getByPlaceholderText('Место')
    const dateInput = screen.getByTestId('calendar-button');

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(categoryInput).toHaveValue('');
      expect(priceInput).toHaveValue('');
      expect(locationInput).toHaveValue('');
      expect(dateInput).toHaveTextContent(new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }));
    });

    // Fill out the form
    await user.type(titleInput, 'Билет на "F1"');
    await user.type(categoryInput, 'Кино');
    await user.type(priceInput, '22');
    await user.type(locationInput, 'Skyline');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /добавить/i });
    await user.click(submitButton);

    expect(api.createExpense).toHaveBeenCalledWith({
      title: 'Билет на "F1"',
      category: 'Кино',
      price: 22,
      location: 'Skyline',
      datetime: expect.any(String)
    });
    
    // Check if the new expense is displayed
    await waitFor(() => {
      expect(screen.getByText('Билет на "F1"')).toBeInTheDocument();
    });
  });

  it('показывает ошибку, если поля ввода не заполнены', async () => {
    const user = userEvent.setup();
    
    render(<ExpensesPage />);

    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    const expenseCard = screen.getByText('Творог 1%').closest('[data-testid^="expense-card"]');
    await user.click(expenseCard!);

    await waitFor(() => {
      expect(screen.getByText('Редактировать расход')).toBeInTheDocument();
    });
    
      await waitFor(() => {
      expect(screen.getByDisplayValue('Творог 1%')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Еда')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2.5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Копеечка')).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue('Творог 1%');
    const categoryInput = screen.getByDisplayValue('Еда');
    const priceInput = screen.getByDisplayValue('2.5');
    const locationInput = screen.getByDisplayValue('Копеечка');

    await user.clear(categoryInput);
    await user.clear(priceInput);
    await user.clear(locationInput);

    await waitFor(() => {
      expect(categoryInput).toHaveValue('');
      expect(priceInput).toHaveValue('');
      expect(locationInput).toHaveValue('');
    });

    // Пытаемся сохранить
    const saveButton = screen.getByRole('button', { name: /сохранить/i });
    await user.click(saveButton);

    // Проверяем что появились сообщения об ошибках
    await waitFor(() => {
      expect(screen.getByText('Заполните поля')).toBeInTheDocument();
    });

    // Проверяем что API НЕ был вызван
    expect(vi.spyOn(api, 'updateExpense')).not.toHaveBeenCalled();

    // Проверяем что старые данные остались в UI
    expect(titleInput).toHaveValue('Творог 1%');

    // Проверяем что модалка не закрылась
    expect(screen.getByText('Редактировать расход')).toBeInTheDocument();
  });
});