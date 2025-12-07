// api.ts
import axios from "axios";
import { type Expense, type ExpenseCreate, type ExpenseUpdate } from "./types"

const getApiBase = () => {
  // Для продакшена используйте env переменную
  // if (import.meta.env.PROD) {
  //   return import.meta.env.VITE_API_URL || "http://localhost:3000";
  // }
  const { hostname } = window.location;
  return `http://${hostname}:3000`;
};

// export const API_BASE = getApiBase();

const api = axios.create({
  // baseURL: API_BASE || "https://localhost:3000",
  baseURL: '/api', // Vite проксирует на нужный адрес
  withCredentials: true,
});

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

export const register = (username: string, password: string) =>
  api.post('/auth/register', { username, password });

export const logout = () => api.post('/auth/logout');

export const fetchExpenses = (filters?: any, sortParams?: any) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        if (key === 'keywords' && Array.isArray(filters[key])) {
          filters[key].forEach((keyword: string, index: number) => {
            params.append(`keywords`, keyword);
          });
        } else {
          params.append(key, filters[key].toString());
        }
      }
    });
  }
  
  if (sortParams) {
    params.append('sortField', sortParams.field);
    params.append('sortDirection', sortParams.direction);
  }
  return api.get(`/expenses?${params.toString()}`);
};

// POST /expenses/
export const createExpense = async (data: ExpenseCreate): Promise<Expense> => {
  const res = await api.post("/expenses", data);
  return res.data;
};

// PUT /expenses/:id
export const updateExpense = async (id: number, updated: ExpenseUpdate): Promise<Expense> => {
  const res = await api.put(`/expenses/${id}`, updated);
  return res.data;
};

// DELETE /expenses/:id
export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};

export const suggestKeywords = async (
  query: string,
  field?: 'title' | 'category' | 'location'
) => {
  return api.get(`/expenses/keywords/suggest?field=${field}&query=${encodeURIComponent(query)}`);
} 