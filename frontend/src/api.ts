// api.ts
import axios from "axios";
import { type Expense, type ExpenseCreate, type ExpenseUpdate } from "./types"


const API_BASE = import.meta.env.PROD ? "/api" : "http://localhost:3000";
const api = axios.create({ 
  baseURL: API_BASE, 
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });

  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  
  return response;
};

export const register = async (username: string, password: string) => {
  const response = await api.post('/auth/register', { username, password });

  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  
  return response;
};

export const logout = () => {
  localStorage.removeItem('token');
  return api.post('/auth/logout');
};

export const fetchExpenses = (filters?: any, sortParams?: any) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        if (key === 'keywords' && Array.isArray(filters[key])) {
          filters[key].forEach((keyword: string) => {
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

export const createExpense = async (data: ExpenseCreate): Promise<Expense> => {
  const res = await api.post("/expenses", data);
  console.log('Response:', res.data);
  console.log('Response headers:', res.headers);
  return res.data;
};

export const updateExpense = async (id: number, updated: ExpenseUpdate): Promise<Expense> => {
  const res = await api.put(`/expenses/${id}`, updated);
  return res.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};

export const suggestKeywords = async (
  query: string,
  field?: 'title' | 'category' | 'location'
) => {
  return api.get(`/expenses/keywords/suggest?field=${field}&query=${encodeURIComponent(query)}`);
} 