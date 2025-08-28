// src/tests/components/SortForm.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpensesPage } from '../../../pages/ExpensesPage';
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setupApiMocks } from './setupTestEnv';

describe('Интеграционный тест выбора сортировки', () => {
  const user = userEvent.setup();

  beforeEach(() => {
      setupApiMocks();
    });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('открыть модальное окно с сортировкой, изменить параметры, применить параметры', async () => {
    render(<ExpensesPage />);

    // Ждем загрузки расходов
    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
      expect(screen.getByText('Рубашка')).toBeInTheDocument();
      expect(screen.getByText('Клавиатура RGB')).toBeInTheDocument();
    });

    // Проверяем начальную сортировку (по дате, убывание)
    const initialItems = screen.getAllByTestId(/expense-card-/);
    expect(initialItems[0]).toHaveTextContent('Рубашка'); // Первая дата
    expect(initialItems[1]).toHaveTextContent('Клавиатура RGB');
    expect(initialItems[2]).toHaveTextContent('Творог 1%'); // Последняя дата

    // Открываем модалку сортировки
    const sortButton = screen.getByText('Сортировка');
    await user.click(sortButton);

    // Проверяем что модалка открылась
    await waitFor(() => {
      expect(screen.getByText('Выбор поля')).toBeInTheDocument();
      expect(screen.getByText('Направление')).toBeInTheDocument();
    });

    // Проверяем начальные значения в форме
    const dataRadio = screen.getByLabelText('Дата');
    const titleRadio = screen.getByLabelText('Название');
    expect(dataRadio).toBeChecked();
    expect(titleRadio).not.toBeChecked();

    const ascendingRadio = screen.getByLabelText('По возрастанию');
    const descendingRadio = screen.getByLabelText('По убыванию');
    expect(descendingRadio).toBeChecked();
    expect(ascendingRadio).not.toBeChecked();

    // Меняем поле сортировки на "Название"
    await user.click(titleRadio);

    // Меняем направление на "По возрастанию"
    await user.click(ascendingRadio);

    // Применяем сортировку
    const applyButton = screen.getByRole('button', { name: /применить/i });
    await user.click(applyButton);

    // Проверяем что модалка закрылась
    await waitFor(() => {
      expect(screen.queryByText('Выбор поля')).not.toBeInTheDocument();
    });

    // Проверяем что расходы отсортированы по названию (A-Z)
    await waitFor(() => {
      const sortedItems = screen.getAllByTestId(/expense-card-/);
      expect(sortedItems[0]).toHaveTextContent('Клавиатура RGB');
      expect(sortedItems[1]).toHaveTextContent('Рубашка');
      expect(sortedItems[2]).toHaveTextContent('Творог 1%');
    });
  });

  it('сортировка по цене в убывающем порядке', async () => {
    render(<ExpensesPage />);

    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    // Открываем модалку сортировки
    const sortButton = screen.getByText('Сортировка');
    await user.click(sortButton);

    await waitFor(() => {
      expect(screen.getByText('Выбор поля')).toBeInTheDocument();
    });

    // Выбираем сортировку по цене
    const priceRadio = screen.getByLabelText('Стоимость');
    await user.click(priceRadio);


    // Выбираем сортировку по убыванию (должна быть выбрана по умолчанию)
    const descendingRadio = screen.getByLabelText('По убыванию');
    expect(descendingRadio).toBeChecked();

    // Применяем сортировку
    const applyButton = screen.getByRole('button', { name: /применить/i });
    await user.click(applyButton);

    // Проверяем сортировку по цене (убывание)
    await waitFor(() => {
      const sortedItems = screen.getAllByTestId(/expense-card-/);
      expect(sortedItems[0]).toHaveTextContent('Клавиатура RGB'); // 10 - самая высокая
      expect(sortedItems[1]).toHaveTextContent('Рубашка');  // 5
      expect(sortedItems[2]).toHaveTextContent('Творог 1%'); // 3 - самая низкая
    });
  });

  it('сортировка по категории в возрастающем порядке', async () => {
    render(<ExpensesPage />);

    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    // Открываем модалку сортировки
    await user.click(screen.getByText('Сортировка'));

    await waitFor(() => {
      expect(screen.getByText('Выбор поля')).toBeInTheDocument();
    });

    // Выбираем сортировку по категории
    const categoryRadio = screen.getByLabelText('Категория');
    await user.click(categoryRadio);

    // Выбираем сортировку по возрастанию
    const ascendingRadio = screen.getByLabelText('По возрастанию');
    await user.click(ascendingRadio);

    // Применяем сортировку
    await user.click(screen.getByRole('button', { name: /применить/i }));

    // Проверяем сортировку по категории (A-Z)
    await waitFor(() => {
      const sortedItems = screen.getAllByTestId(/expense-card-/);
      expect(sortedItems[0]).toHaveTextContent('Еда'); // Еда - Е
      expect(sortedItems[1]).toHaveTextContent('Компьютерная периферия');  // Компьютерная периферия - К
      expect(sortedItems[2]).toHaveTextContent('Одежда'); // Одежда - О
    });
  });

  it('закрытие окна без применения параметров сортировки', async () => {
    render(<ExpensesPage />);

    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    // Запоминаем первоначальный порядок
    const initialItems = screen.getAllByTestId(/expense-card-/);
    const initialOrder = initialItems.map(item => item.textContent);

    // Открываем модалку сортировки
    await user.click(screen.getByText('Сортировка'));

    await waitFor(() => {
      expect(screen.getByText('Выбор поля')).toBeInTheDocument();
    });

    // Меняем параметры сортировки
    const titleRadio = screen.getByLabelText('Название');
    await user.click(titleRadio);


    const ascendingRadio = screen.getByLabelText('По возрастанию');
    await user.click(ascendingRadio);

    // Отменяем сортировку
    const cancelButton = screen.getByRole('button', { name: /отмена/i });
    await user.click(cancelButton);

    // Проверяем что модалка закрылась и порядок не изменился
    await waitFor(() => {
      expect(screen.queryByText('Выбор поля')).not.toBeInTheDocument();
    });

    const finalItems = screen.getAllByTestId(/expense-card-/);
    const finalOrder = finalItems.map(item => item.textContent);

    expect(finalOrder).toEqual(initialOrder);
  });

  it('сортировка должна сохраняться после взаимодействия с другими окнами', async () => {
    render(<ExpensesPage />);

    await waitFor(() => {
      expect(screen.getByText('Творог 1%')).toBeInTheDocument();
    });

    // Устанавливаем сортировку по названию (A-Z)
    await user.click(screen.getByText('Сортировка'));
    
    await waitFor(() => {
      expect(screen.getByText('Выбор поля')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Название'));
    await user.click(screen.getByLabelText('По возрастанию'));
    await user.click(screen.getByRole('button', { name: /применить/i }));

    // Проверяем сортировку
    await waitFor(() => {
      const sortedItems = screen.getAllByTestId(/expense-card-/);
      expect(sortedItems[0]).toHaveTextContent('Компьютерная периферия');
      expect(sortedItems[1]).toHaveTextContent('Рубашка');
      expect(sortedItems[2]).toHaveTextContent('Творог 1%');
    });

    // Выполняем другие действия (например, открываем другую модалку)
    await user.click(screen.getByText('Фильтры'));
    await user.click(screen.getByRole('button', { name: /Отмена/i }));

    // Проверяем что сортировка сохранилась
    await waitFor(() => {
      const items = screen.getAllByTestId(/expense-card-/);
      expect(items[0]).toHaveTextContent('Компьютерная периферия');
      expect(items[1]).toHaveTextContent('Рубашка');
      expect(items[2]).toHaveTextContent('Творог 1%');
    });
  });
});