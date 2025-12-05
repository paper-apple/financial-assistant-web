// types.tsx
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
  category: Category;
  price: number;
  location: Location;
  datetime: string;
}

export interface ExpenseFormType {
  initialData?: Expense;
  onCreated?: (created: Expense) => void;
  onUpdated?: (updated: Expense) => void;
  onCalendarOpen: () => void;
  onModalClose: () => void;
};

export interface ExpenseCreate {
  title: string;
  category: string;
  price: number;
  location: string;
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

export type GroupField = "title" | "category" | "location";

type SortField = GroupField | "price" | "datetime";

export type SortParams = {
  field: SortField;
  direction: "ASC" | "DESC";
};

export type FormState = {
  title: string;
  category: string;
  price: string;
  location: string;
  datetime: string;
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