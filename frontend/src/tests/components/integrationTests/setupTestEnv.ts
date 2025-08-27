import * as api from "../../../api";
import { vi } from "vitest";

const mockExpenses = [
  {
    id: 1,
    title: 'Творог 1%',
    category: 'Еда',
    price: 2.5,
    location: 'Копеечка',
    datetime: '2025-01-01T12:00:00.000Z'
  },
  {
    id: 2,
    title: 'Рубашка',
    category: 'Одежда',
    price: 49,
    location: 'Marc Formelle',
    datetime: '2025-01-03T10:00:00.000Z'
  },
  {
    id: 3,
    title: 'Клавиатура RGB',
    category: 'Компьютерная периферия',
    price: 112.54,
    location: '5 элемент',
    datetime: '2025-01-02T08:00:00.000Z'
  }
]

export function setupApiMocks() {
    vi.spyOn(api, 'fetchExpenses').mockResolvedValue({
      data: mockExpenses,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {}, method: 'get', url: '' } as any
    });
    vi.spyOn(api, 'deleteExpense').mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      data: undefined
    });
}
