import axios from "axios";
import { type Expense, type ExpenseCreate, type ExpenseUpdate, type Category, type Location } from "./types"

// Динамическое определение адреса API
const getApiBase = () => {
  // Для продакшена используйте env переменную
  // if (import.meta.env.PROD) {
  //   return import.meta.env.VITE_API_URL || "http://localhost:3000";
  // }
  
  // Для разработки используем текущий hostname
  const { hostname } = window.location;
  console.log(hostname)
  return `http://${hostname}:3000`;
};

export const API_BASE = getApiBase();

const api = axios.create({
  baseURL: API_BASE || "https://localhost:3000",
  withCredentials: true, // ✅ Это заставляет axios отправлять cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

export const register = (username: string, password: string) =>
  api.post('/auth/register', { username, password });

export const logout = () => api.post('/auth/logout');

export const fetchExpenses = (filters?: any, sortParams?: any) => {
  const params = new URLSearchParams();
  
// Добавляем фильтры
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        if (key === 'keywords' && Array.isArray(filters[key])) {
          // Для массива ключевых слов добавляем каждый элемент отдельно
          // filters[key].forEach((keyword: string, index: number) => {
          //   params.append(`keywords[${index}]`, keyword);
          filters[key].forEach((keyword: string) => {
            params.append(`keywords[]`, keyword);
          });
        } else {
          params.append(key, filters[key].toString());
        }
      }
    });
  }
  
  // Добавляем параметры сортировки
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

// export const fetchCategories = (): Promise<Category[]> =>
//   api.get<Category[]>("/categories").then(res => res.data);

// export const createCategory = (data: { name: string }): Promise<Category> =>
//   api.post<Category>("/categories", data).then(res => res.data);

// // Места
// export const fetchLocations = (): Promise<Location[]> =>
//   api.get<Location[]>("/locations").then(res => res.data);

// export const createLocation = (data: { name: string }): Promise<Location> =>
//   api.post<Location>("/locations", data).then(res => res.data);