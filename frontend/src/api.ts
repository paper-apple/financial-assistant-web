import axios from "axios";
import { type Expense, type ExpenseCreate, type ExpenseUpdate, type Category, type Location } from "./types"

const API_BASE = "https://192.168.100.4:3000";

// const api = axios.create({
//   baseURL: API_BASE,
// });

const api = axios.create({
  baseURL: API_BASE || "https://localhost:3000",
  withCredentials: true, // ✅ Это заставляет axios отправлять cookies
});

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

export const register = (username: string, password: string) =>
  api.post('/auth/register', { username, password });

export const logout = () => api.post('/auth/logout');
// GET /expenses/
export const fetchExpenses = () => 
  api.get("/expenses"); // Убрал ${API_BASE} - он уже в baseURL

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