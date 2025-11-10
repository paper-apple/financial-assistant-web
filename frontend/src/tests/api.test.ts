// api.test.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

vi.mock('axios', () => {
  const mockPost = vi.fn()
  const mockGet = vi.fn()
  const mockPut = vi.fn()
  const mockDelete = vi.fn()

  return {
    default: {
      create: vi.fn(() => ({
        post: mockPost,
        get: mockGet,
        put: mockPut,
        delete: mockDelete,
      }))
    }
  }
})

import axios from 'axios'
import { fetchExpenses, createExpense, API_BASE } from '../api'

describe('API Module', () => {
  let mockAxios: any

  beforeEach(() => {
    mockAxios = (axios.create as Mock)()
    vi.clearAllMocks()
  })

  it('API_BASE должен быть localhost:3000', () => {
    expect(API_BASE).toBe( 'http://localhost:3000')
  })

  it('fetchExpenses возвращает правильные данные', async () => {
    mockAxios.get.mockResolvedValue({ data: [{ id: 1, title: 'Test' }] })
    
    const result = await fetchExpenses()
    
    expect(mockAxios.get).toHaveBeenCalledWith('/expenses?')
    expect(result.data).toEqual([{ id: 1, title: 'Test' }])
  })

  it('createExpense возвращает правильные данные', async () => {
    const expenseData = {
      title: 'Обед',
      category: 'Еда',
      price: 15,
      location: 'Кафе',
      datetime: '2025-01-15T12:00:00Z'
    }
    mockAxios.post.mockResolvedValue({ data: { id: 1, ...expenseData } })
    
    const result = await createExpense(expenseData)
    
    expect(mockAxios.post).toHaveBeenCalledWith('/expenses', expenseData)
    expect(result).toEqual({ id: 1, ...expenseData })
  })
})