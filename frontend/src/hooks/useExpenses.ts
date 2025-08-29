// hooks/useExpenses.ts
import { useState, useEffect } from "react";
import { deleteExpense, fetchExpenses } from "../api";
import type { Expense } from "../types";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [lastUpdatedId, setLastUpdatedId] = useState<number | null>(null);

  // const loadExpenses = async () => {
  //   const res = await fetchExpenses();
  //   setExpenses(res.data);
  // };
  const loadExpenses = async () => {
    try {
      const response = await fetchExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error("Ошибка загрузки расходов:", error);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    if (lastUpdatedId !== null) {
      const timer = setTimeout(() => setLastUpdatedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedId]);

  const updateExpense = (updated: Expense) => {
    setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    setLastUpdatedId(updated.id);
  };

  const addExpense = (created: Expense) => {
    setExpenses(prev => [...prev, created]);
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