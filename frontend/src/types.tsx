// export type Expense = {
//   id: number;
//   title: string;
//   category: string;
//   price: number;
//   location: string;
//   datetime: string; // ISO
// }

export interface Category {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  title: string;
  category: Category; // Теперь это объект, а не строка
  price: number;
  location: Location; // Теперь это объект, а не строка
  datetime: string;
}

// Типы для создания/обновления расходов
export interface ExpenseCreate {
  title: string;
  category: string; // При создании передаем строку
  price: number;
  location: string; // При создании передаем строку
  datetime: string;
}

export interface ExpenseUpdate {
  title?: string;
  category?: string; // При обновлении передаем строку
  price?: number;
  location?: string; // При обновлении передаем строку
  datetime?: string;
}

export type FilterParams = {
  startDate: Date | null;
  endDate: Date | null;
  minPrice: number | null;
  maxPrice: number | null;
  keywords:  string[];      // добавили опциональное ключевое слово
};

type SortField = "title" | "category" | "price" | "location" | "datetime";

export type SortParams = {
  field: SortField;
  direction: "asc" | "desc";
};

export type FormState = {
  title: string;
  category: string;
  price: string;      // именно string, т.к. в useState ты делаешь String(...)
  location: string;
  datetime: string;   // ISO-строка
};