// // src/api.ts
// import axios from "axios";
// import { type Expense } from "./types"

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
// });

// const API_BASE = "http://192.168.100.4:3000";

// // GET /expenses/
// export const fetchExpenses = () => api.get<Expense[]>(`${API_BASE}/expenses`);

// // POST /expenses/
// export const createExpense = async (
//   data: Omit<Expense, "id">
// ): Promise<Expense> => {
//   const res = await axios.post(`${API_BASE}/expenses`, data);
//   return res.data; // ✅ теперь вернётся Expense, не AxiosResponse
// };

// export const updateExpense = async (
//   id: number,
//   updated: Omit<Expense, "id">
// ) => {
//   const res = await axios.put(`${API_BASE}/expenses/${id}`, updated);
//   return res.data;
// };

// export const deleteExpense = (id: number) =>
//   axios.delete<void>(`${API_BASE}/expenses/${id}`);

import axios from "axios";
import { type Expense, type ExpenseCreate, type ExpenseUpdate, type Category, type Location } from "./types"

const API_BASE = "http://192.168.100.4:3000";

// const api = axios.create({
//   baseURL: API_BASE,
// });

const api = axios.create({
  baseURL: API_BASE || "http://localhost:3000",
});

// GET /expenses/
// export const fetchExpenses = () => 
//   api.get<Expense[]>("${API_BASE}/expenses");
export const fetchExpenses = () => 
  api.get<Expense[]>("/expenses"); // Убрал ${API_BASE} - он уже в baseURL

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

// Категории
export const fetchCategories = (): Promise<Category[]> =>
  api.get<Category[]>("/categories").then(res => res.data);

export const createCategory = (data: { name: string }): Promise<Category> =>
  api.post<Category>("/categories", data).then(res => res.data);

// Места
export const fetchLocations = (): Promise<Location[]> =>
  api.get<Location[]>("/locations").then(res => res.data);

export const createLocation = (data: { name: string }): Promise<Location> =>
  api.post<Location>("/locations", data).then(res => res.data);