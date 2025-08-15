// hooks/useFilterSort.ts
import { useState, useMemo, useCallback } from "react";
import type { Expense, FilterParams, SortParams } from "../types";

export const useFilterSort = (expenses: Expense[]) => {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: null,
    endDate: null,
    minPrice: null,
    maxPrice: null,
    keywords: [],
  });

  const [sortParams, setSortParams] = useState<SortParams>({
    field: "datetime",
    direction: "desc",
  });

  const comparators = useMemo(() => ({
    title: (a: Expense, b: Expense) => a.title.localeCompare(b.title),
    category: (a: Expense, b: Expense) => a.category.localeCompare(b.category),
    price: (a: Expense, b: Expense) => Number(a.price) - Number(b.price),
    location: (a: Expense, b: Expense) => a.location.localeCompare(b.location),
    datetime: (a: Expense, b: Expense) => 
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  }), []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const date = new Date(exp.datetime);
      const price = Number(exp.price);

      return (
        (!filters.startDate || date >= filters.startDate) &&
        (!filters.endDate || date <= filters.endDate) &&
        (!filters.minPrice || price >= filters.minPrice) &&
        (!filters.maxPrice || price <= filters.maxPrice) &&
        (filters.keywords.length === 0 || 
          filters.keywords.some(term => 
            exp.title.toLowerCase().includes(term) ||
            exp.category.toLowerCase().includes(term) ||
            exp.location.toLowerCase().includes(term)
          )
        )
      );
    });
  }, [expenses, filters]);

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      const cmp = comparators[sortParams.field]?.(a, b) ?? 0;
      return sortParams.direction === "asc" ? cmp : -cmp;
    });
  }, [filteredExpenses, sortParams, comparators]);

  const handleFilters = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
  }, []);

  const handleSortApply = useCallback((newSort: SortParams) => {
    setSortParams(newSort);
  }, []);

  return {
    filters,
    sortParams,
    filteredExpenses,
    sortedExpenses,
    handleFilters,
    handleSortApply,
    setFilters,
    setSortParams
  };
};