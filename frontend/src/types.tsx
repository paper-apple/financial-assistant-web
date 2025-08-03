export type FilterParams = {
  startDate: Date | null;
  endDate: Date | null;
  minPrice: number | null;
  maxPrice: number | null;
  keywords:  string[];      // добавили опциональное ключевое слово
};

export type ItemType = {
  id: string;
  title: string;
  description?: string;
  amount: number;
  date: string; // или Date, если ты парсишь JSON
};

export type SortParams = {
  field: "title" | "category" | "price" | "location" | "datetime";
  direction: "asc" | "desc";
};

