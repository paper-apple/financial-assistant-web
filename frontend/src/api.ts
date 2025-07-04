// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

const API_BASE = "http://localhost:8000";

export interface Expense {
  id: number;
  title: string;
  category: string;
  price: number;
  location: string;
  datetime: string; // ISO
}

// // GET /expenses/
// export const fetchExpenses = () => api.get<Expense[]>("/expenses/");

// // POST /expenses/
// export const createExpense = (expense: Omit<Expense, "id">) =>
//   api.post<Expense>("/expenses/", expense);

// export const updateExpense = async (
//   id: number,
//   updated: Omit<Expense, "id">
// ) => {
//   const res = await axios.put(`/expenses/${id}`, updated);
//   return res.data;
// };

// GET /expenses/
export const fetchExpenses = () => api.get<Expense[]>(`${API_BASE}/expenses`);

// POST /expenses/
export const createExpense = (expense: Omit<Expense, "id">) =>
  api.post<Expense>(`${API_BASE}/expenses`, expense);

export const updateExpense = async (
  id: number,
  updated: Omit<Expense, "id">
) => {
  const res = await axios.put(`${API_BASE}/expenses/${id}`, updated);
  return res.data;
};
