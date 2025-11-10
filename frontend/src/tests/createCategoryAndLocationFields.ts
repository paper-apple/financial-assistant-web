// createCategoryAndLocationFields.ts
import type { Category, Location } from "../types";

export const makeCategory = (id: number, name: string): Category => ({ id, name });
export const makeLocation = (id: number, name: string): Location => ({ id, name });