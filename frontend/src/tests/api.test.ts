// // api.test.ts
// import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

// vi.mock('axios', () => {
//   const mockPost = vi.fn()
//   const mockGet = vi.fn()
//   const mockPut = vi.fn()
//   const mockDelete = vi.fn()

//   return {
//     default: {
//       create: vi.fn(() => ({
//         post: mockPost,
//         get: mockGet,
//         put: mockPut,
//         delete: mockDelete,
//       }))
//     }
//   }
// })

// import axios from 'axios'
// import { fetchExpenses, createExpense } from '../api'

// describe('API Module', () => {
//   let mockAxios: any

//   beforeEach(() => {
//     mockAxios = (axios.create as Mock)()
//     vi.clearAllMocks()
//   })

//   it('API_BASE должен быть localhost:3000', () => {
//     expect(API_BASE).toBe( 'http://localhost:3000')
//   })

//   it('fetchExpenses возвращает правильные данные', async () => {
//     mockAxios.get.mockResolvedValue({ data: [{ id: 1, title: 'Test' }] })
    
//     const result = await fetchExpenses()
    
//     expect(mockAxios.get).toHaveBeenCalledWith('/expenses?')
//     expect(result.data).toEqual([{ id: 1, title: 'Test' }])
//   })

//   it('createExpense возвращает правильные данные', async () => {
//     const expenseData = {
//       title: 'Обед',
//       category: 'Еда',
//       price: 15,
//       location: 'Кафе',
//       datetime: '2025-01-15T12:00:00Z'
//     }
//     mockAxios.post.mockResolvedValue({ data: { id: 1, ...expenseData } })
    
//     const result = await createExpense(expenseData)
    
//     expect(mockAxios.post).toHaveBeenCalledWith('/expenses', expenseData)
//     expect(result).toEqual({ id: 1, ...expenseData })
//   })
// })

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('axios', () => {
  const mockPost = vi.fn();
  const mockGet = vi.fn();
  const mockPut = vi.fn();
  const mockDelete = vi.fn();

  return {
    default: {
      create: vi.fn(() => ({
        post: mockPost,
        get: mockGet,
        put: mockPut,
        delete: mockDelete,
      })),
    },
  };
});

import axios from 'axios';
import { fetchExpenses, createExpense, updateExpense, deleteExpense, suggestKeywords } from '../api';

describe('API Module', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = (axios.create as Mock)();
    vi.clearAllMocks();
  });

  it('fetchExpenses вызывает GET /expenses? с пустыми параметрами', async () => {
    mockAxios.get.mockResolvedValue({ data: [{ id: 1 }] });

    const result = await fetchExpenses();

    expect(mockAxios.get).toHaveBeenCalledWith('/expenses?');
    expect(result.data).toEqual([{ id: 1 }]);
  });

  it('fetchExpenses добавляет фильтры в query string', async () => {
    mockAxios.get.mockResolvedValue({ data: [] });

    await fetchExpenses({ category: 'Food', keywords: ['a', 'b'] });

    expect(mockAxios.get).toHaveBeenCalledWith('/expenses?category=Food&keywords=a&keywords=b');
  });

  it('createExpense вызывает POST /expenses', async () => {
    const expenseData = {
      title: 'Обед',
      category: 'Еда',
      price: 15,
      location: 'Кафе',
      datetime: '2025-01-15T12:00:00Z',
    };

    mockAxios.post.mockResolvedValue({ data: { id: 1, ...expenseData } });

    const result = await createExpense(expenseData);

    expect(mockAxios.post).toHaveBeenCalledWith('/expenses', expenseData);
    expect(result).toEqual({ id: 1, ...expenseData });
  });

  it('updateExpense вызывает PUT /expenses/:id', async () => {
    mockAxios.put.mockResolvedValue({ data: { id: 1, title: 'Updated' } });

    const result = await updateExpense(1, { title: 'Updated' });

    expect(mockAxios.put).toHaveBeenCalledWith('/expenses/1', { title: 'Updated' });
    expect(result).toEqual({ id: 1, title: 'Updated' });
  });

  it('deleteExpense вызывает DELETE /expenses/:id', async () => {
    mockAxios.delete.mockResolvedValue({});

    await deleteExpense(5);

    expect(mockAxios.delete).toHaveBeenCalledWith('/expenses/5');
  });

  it('suggestKeywords вызывает GET /expenses/keywords/suggest', async () => {
    mockAxios.get.mockResolvedValue({ data: ['a', 'b'] });

    const result = await suggestKeywords('кафе', 'location');

    expect(mockAxios.get).toHaveBeenCalledWith(
      '/expenses/keywords/suggest?field=location&query=%D0%BA%D0%B0%D1%84%D0%B5'
    );

    expect(result.data).toEqual(['a', 'b']);
  });
});
