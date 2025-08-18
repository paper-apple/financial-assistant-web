export type Expense = {
  id: number;
  title: string;
  category: string;
  price: number;
  location: string;
  datetime: string; // ISO
}

export type FilterParams = {
  startDate: Date | null;
  endDate: Date | null;
  minPrice: number | null;
  maxPrice: number | null;
  keywords:  string[];      // добавили опциональное ключевое слово
};

// export type ItemType = {
//   id: string;
//   title: string;
//   description?: string;
//   amount: number;
//   date: string; // или Date, если ты парсишь JSON
// };

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
