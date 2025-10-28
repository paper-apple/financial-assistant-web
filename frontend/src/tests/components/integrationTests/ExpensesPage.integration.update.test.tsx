import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpensesPage } from '../../../components/ExpensesPage';
import * as api from "../../../api";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setupApiMocks } from './setupTestEnv';

describe('Редактирование расхода', () => {
  beforeEach(() => {
    setupApiMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('расходы загружаются и отображаются', async () => {
    render(<ExpensesPage />);
    
    // Wait for expenses to load
    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
      expect(screen.getByText('Рубашка')).toBeInTheDocument();
    });
  });

  it('завершение полоного процесса редактирования: нажать на карточку → открыть модальное окно → редактировать поля → сохранить → обновить UI', async () => {
    // Подготавливаем моки
    const updatedExpense = {
      id: 1,
      title: 'Творог 3%',
      category: 'Еда',
      price: 2.75,
      location: 'Доброном',
      datetime: '2023-01-01T12:00:00.000Z'
    };
    const user = userEvent.setup();
    vi.spyOn(api, 'updateExpense').mockResolvedValue(updatedExpense);
    
    // Рендерим компонент
    render(<ExpensesPage />);

    // Ждем загрузки расходов
    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
      expect(screen.getByText('Рубашка')).toBeInTheDocument();
    });

    // Находим и кликаем на карточку для редактирования
    const expenseCard = screen.getByText('Творог 1%').closest('[data-testid^="expense-card"]');
    await user.click(expenseCard!);

    // Проверяем что модальное окно редактирования открылось
    await waitFor(() => {
      expect(screen.getByText('Редактировать расход')).toBeInTheDocument();
    });

    // Проверяем что поля автоматически заполнились данными карточки
    expect(screen.getByDisplayValue('Творог 1%')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Еда')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Копеечка')).toBeInTheDocument();

    // Редактируем поля формы
    const titleInput = screen.getByDisplayValue('Творог 1%');
    const categoryInput = screen.getByDisplayValue('Еда');
    const priceInput = screen.getByDisplayValue('2.5');
    const locationInput = screen.getByDisplayValue('Копеечка');

    // Очищаем и вводим новые значения
    await user.clear(titleInput);
    await user.type(titleInput, 'Творог 3%');

    await user.clear(categoryInput);
    await user.type(categoryInput, 'Еда');

    await user.clear(priceInput);
    await user.type(priceInput, '2.75');

    await user.clear(locationInput);
    await user.type(locationInput, 'Доброном');

    // Находим карточку и проверяем, что она НЕ подсвечена изначально
    const highlightCard = screen.getByTestId('highlight-1');
    expect(highlightCard).not.toHaveClass('opacity-100');

    // Нажимаем кнопку сохранения
    const saveButton = screen.getByRole('button', { name: /сохранить/i });
    await user.click(saveButton);

    // Проверяем что API был вызван с правильными данными
    expect(api.updateExpense).toHaveBeenCalledTimes(1);
    expect(api.updateExpense).toHaveBeenCalledWith(1, {
      title: 'Творог 3%',
      category: 'Еда',
      price: 2.75,
      location: 'Доброном',
      datetime: '2023-01-01T12:00:00.000Z'
    });

    // Проверяем что модальное окно закрылось
    await waitFor(() => {
      expect(screen.queryByText('Редактировать расход')).not.toBeInTheDocument();
    });

    // Проверяем что UI обновился с новыми данными
    await waitFor(() => {
      expect(screen.getByText('Творог 3%')).toBeInTheDocument();
      expect(screen.getByText('Еда')).toBeInTheDocument();
      expect(screen.getByText('2.75 ₽')).toBeInTheDocument();

    // Старые данные не должны отображаться
      expect(screen.queryByText('Творог 1%')).not.toBeInTheDocument();
    });

    expect(highlightCard).toHaveClass('opacity-100');

    // Проверяем, что подсветка исчезла
    await new Promise(resolve => setTimeout(resolve, 2100));

    await waitFor(() => {
      expect(highlightCard).not.toHaveClass('opacity-100');
      expect(highlightCard).toHaveClass('opacity-0');
    });
  }, 10000);
});