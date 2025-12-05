// useExpenses.ts
import { useState, useEffect, useCallback } from "react";
import { deleteExpense, fetchExpenses } from "../api";
import type { SortParams, Expense } from "../types";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [lastUpdatedId, setLastUpdatedId] = useState<number | null>(null);
  const [filters, setFilters] = useState({});
  const [sortParams, setSortParams] = useState<SortParams>({
    field: 'datetime',
    direction: 'DESC'
  });

  const loadExpenses = useCallback(async (newFilters?: any, newSortParams?: any) => {
    try {
      const currentFilters = newFilters || filters;
      const currentSortParams = newSortParams || sortParams;
      
      if (newFilters) setFilters(newFilters);
      if (newSortParams) setSortParams(newSortParams);
      
      const response = await fetchExpenses(currentFilters, currentSortParams);
      setExpenses(response.data);
    } catch (error) {
      console.error('Ошибка загрузки расходов:', error);
    }
  }, [filters, sortParams]);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    if (lastUpdatedId !== null) {
      const timer = setTimeout(() => setLastUpdatedId(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedId]);

  const updateExpense = (updated: Expense) => {
    setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    setLastUpdatedId(updated.id);
  };

  const addExpense = (created: Expense) => {
    setExpenses(prev => [...prev, created]);
    setLastUpdatedId(created.id);
  };

  const removeExpenses = async (ids: number[]) => {
    await Promise.all(ids.map(id => deleteExpense(id)));
    await loadExpenses();
  };

  return {
    expenses,
    lastUpdatedId,
    loadExpenses,
    updateExpense,
    addExpense,
    removeExpenses
  };
};