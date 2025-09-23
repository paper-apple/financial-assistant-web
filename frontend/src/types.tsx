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

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Expense {
  id: number;
  title: string;
  category: Category; // Теперь это объект, а не строка
  price: number;
  location: Location; // Теперь это объект, а не строка
  datetime: string;
  // user: User;
}

export interface ExpenseFormType {
  initialData?: Expense;
  onCreated?: (created: Expense) => void;
  onUpdated?: (updated: Expense) => void;
  onCalendarOpen: () => void;
  onModalClose: () => void;
};

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
  category?: string;
  price?: number;
  location?: string;
  datetime?: string;
}

export type FilterParams = {
  startDate: Date | null;
  endDate: Date | null;
  minPrice: number | null;
  maxPrice: number | null;
  keywords:  string[];
};

export type FiltersState = {
  keywordInput: string;
  setKeywordInput: React.Dispatch<React.SetStateAction<string>>;
  keywordsList: string[];
  setKeywordsList: React.Dispatch<React.SetStateAction<string[]>>;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  minPrice: string;
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;
  maxPrice: string;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
  dateError: boolean;
  priceError: boolean;
  backup: () => void;
  restoreInitialValues: () => void;
  handleResetFilters: () => void;
};

export type SortState = {
  sortField: SortParams['field'];
  setSortField: React.Dispatch<React.SetStateAction<SortParams['field']>>;
  sortDirection: SortParams['direction'];
  setSortDirection: React.Dispatch<React.SetStateAction<SortParams['direction']>>;
};

type SortField = "title" | "category" | "price" | "location" | "datetime";

export type SortParams = {
  field: SortField;
  // direction: "asc" | "desc";
  direction: "ASC" | "DESC";
};

export type FormState = {
  title: string;
  category: string;
  price: string;      // именно string, т.к. в useState ты делаешь String(...)
  location: string;
  datetime: string;   // ISO-строка
};

  export type Modals = {
    add: boolean;
    update: boolean;
    filters: boolean;
    sort: boolean;
    stats: boolean;
    calendar: boolean;
    startDate: boolean;
    endDate: boolean;
  };