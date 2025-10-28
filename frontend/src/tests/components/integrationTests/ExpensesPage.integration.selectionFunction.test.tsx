import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpensesPage } from '../../../components/ExpensesPage';
import * as api from "../../../api";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setupApiMocks } from './setupTestEnv';

describe('ExpensesPage интеграционный тест', () => {
  const user = userEvent.setup();
  
  beforeEach(() => {
    setupApiMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('вход в режим множественного выбора карточек и выбор/отмена выбора карточек', async () => {
    render(<ExpensesPage />);

    // Ждем загрузки расходов
    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    // Симулируем long press на первой карточке
    const firstCard = screen.getByTestId('expense-card-1');
    fireEvent.mouseDown(firstCard);
    
    // Ждем достаточно времени для long press (400ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    fireEvent.mouseUp(firstCard);

    // Проверяем что режим выбора активирован
    await waitFor(() => {
      expect(screen.getByText('1 выбрано')).toBeInTheDocument();
    });

    // Проверяем что карточка выделена
    expect(firstCard).toHaveClass('bg-blue-50');
    expect(firstCard).toHaveClass('border-blue-500');

    // Выбираем вторую карточку обычным кликом
    const secondCard = screen.getByTestId('expense-card-2');
    await user.click(secondCard);

    // Проверяем что теперь выбрано 2 карточки
    await waitFor(() => {
      expect(screen.getByText('2 выбрано')).toBeInTheDocument();
    });

    // Проверяем что вторая карточка тоже выделена
    expect(secondCard).toHaveClass('bg-blue-50');
    expect(secondCard).toHaveClass('border-blue-500');

    // Снимаем выделение с первой карточки
    await user.click(firstCard);

    // Проверяем что осталась только одна карточка
    await waitFor(() => {
      expect(screen.getByText('1 выбрано')).toBeInTheDocument();
    });

    // Проверяем что первая карточка больше не выделена
    expect(firstCard).not.toHaveClass('bg-blue-50');
    expect(firstCard).not.toHaveClass('border-blue-500');
  });

  it('работа кнопок "Выделить всё" и "Снять всё"', async () => {
    render(<ExpensesPage />);

    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    // Активируем режим выбора через long press
    const firstCard = screen.getByTestId('expense-card-1');
    fireEvent.mouseDown(firstCard);
    await new Promise(resolve => setTimeout(resolve, 500));
    fireEvent.mouseUp(firstCard);

    await waitFor(() => {
      expect(screen.getByText('1 выбрано')).toBeInTheDocument();
    });

    // Нажимаем "Выделить всё"
    const selectAllButton = screen.getByText('Выделить всё');
    await user.click(selectAllButton);

    // Проверяем что все карточки выделены
    await waitFor(() => {
      expect(screen.getByText('3 выбрано')).toBeInTheDocument();
    });

    const allCards = [
      screen.getByTestId('expense-card-1'),
      screen.getByTestId('expense-card-2'),
      screen.getByTestId('expense-card-3')
    ];

    allCards.forEach(card => {
      expect(card).toHaveClass('bg-blue-50');
      expect(card).toHaveClass('border-blue-500');
    });

    // Нажимаем "Снять всё"
    await user.click(selectAllButton); // Теперь кнопка должна называться "Снять всё"

    // Проверяем что выделение снято
    await waitFor(() => {
      expect(screen.getByText('0 выбрано')).toBeInTheDocument();
    });

    allCards.forEach(card => {
      expect(card).not.toHaveClass('bg-blue-50');
      expect(card).not.toHaveClass('border-blue-500');
    });
  });

  it('удаление выбранных карточек', async () => {
    render(<ExpensesPage />);

    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    // Активируем режим выбора и выбираем две карточки
    const firstCard = screen.getByTestId('expense-card-1');
    const secondCard = screen.getByTestId('expense-card-2');
    
    fireEvent.mouseDown(firstCard);
    await new Promise(resolve => setTimeout(resolve, 500));
    fireEvent.mouseUp(firstCard);

    await waitFor(() => {
      expect(screen.getByText('1 выбрано')).toBeInTheDocument();
    });

    await user.click(secondCard);

    await waitFor(() => {
      expect(screen.getByText('2 выбрано')).toBeInTheDocument();
    });

    // Нажимаем кнопку удаления
    const deleteButton = screen.getByText('Удалить');
    await user.click(deleteButton);

    // Проверяем что deleteExpense был вызван дважды с правильными ID
    expect(api.deleteExpense).toHaveBeenCalledTimes(2);
    expect(api.deleteExpense).toHaveBeenCalledWith(1);
    expect(api.deleteExpense).toHaveBeenCalledWith(2);

    // Проверяем что режим выбора закрылся
    await waitFor(() => {
      expect(screen.queryByText('2 выбрано')).not.toBeInTheDocument();
    });

    // Проверяем что расходы перезагрузились
    await waitFor(() => {
      expect(api.fetchExpenses).toHaveBeenCalledTimes(2); // Первый вызов + после удаления
    });
  });

  it('нажатие на кнопку "Отмена"', async () => {
    render(<ExpensesPage />);

    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    // Активируем режим выбора
    const firstCard = screen.getByTestId('expense-card-1');
    fireEvent.mouseDown(firstCard);
    await new Promise(resolve => setTimeout(resolve, 500));
    fireEvent.mouseUp(firstCard);

    await waitFor(() => {
      expect(screen.getByText('1 выбрано')).toBeInTheDocument();
    });

    // Нажимаем "Отмена"
    const cancelButton = screen.getByText('Отмена');
    await user.click(cancelButton);

    // Проверяем что режим выбора закрылся
    await waitFor(() => {
      expect(screen.queryByText('1 выбрано')).not.toBeInTheDocument();
    });

    // Проверяем что карточка больше не выделена
    expect(firstCard).not.toHaveClass('bg-blue-50');
    expect(firstCard).not.toHaveClass('border-blue-500');
  });
});