// useExpenseForm.ts
import { useState, useCallback } from "react";
import type { Expense, FormState } from "../types";

export const useExpenseForm = () => {
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "",
    price: "",
    location: "",
    datetime: new Date().toISOString(),
  });

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const updateFormField = useCallback(<K extends keyof FormState>(
    key: K, 
    value: FormState[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const initFormFromExpense = useCallback((expense?: Expense) => {
    return {
      title: expense?.title || "",
      category: expense?.category?.name || "",
      price: expense ? String(expense.price) : "",
      location: expense?.location?.name || "",
      datetime: expense?.datetime || new Date().toISOString(),
    };
  }, []);

  const setFormFromExpense = useCallback((expense: Expense | null) => {
    setEditingExpense(expense);
    setForm(initFormFromExpense(expense ?? undefined));
  }, []);

  const resetForm = useCallback(() => {
    setForm(initFormFromExpense());
    setEditingExpense(null);
  }, []);

  return {
    form,
    editingExpense,
    updateFormField,
    setFormFromExpense,
    setEditingExpense,
    resetForm,
  };
};