// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

const API_BASE = "http://192.168.100.4:8000";

export interface Expense {
  id: number;
  title: string;
  category: string;
  price: number;
  location: string;
  datetime: string; // ISO
}

// GET /expenses/
export const fetchExpenses = () => api.get<Expense[]>(`${API_BASE}/expenses`);

// POST /expenses/
export const createExpense = async (
  data: Omit<Expense, "id">
): Promise<Expense> => {
  const res = await axios.post(`${API_BASE}/expenses`, data);
  return res.data; // ✅ теперь вернётся Expense, не AxiosResponse
};

export const updateExpense = async (
  id: number,
  updated: Omit<Expense, "id">
) => {
  const res = await axios.put(`${API_BASE}/expenses/${id}`, updated);
  return res.data;
};

export const deleteExpense = (id: number) =>
  axios.delete<void>(`${API_BASE}/expenses/${id}`);
