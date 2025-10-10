import type { Category, Location, Expense } from "../types";

export const makeCategory = (id: number, name: string): Category => ({ id, name });
export const makeLocation = (id: number, name: string): Location => ({ id, name });