// // hooks/useExpenseForm.ts
// import { useState, useCallback, useEffect } from "react";
// import type { Expense, FormState } from "../types";

// export const useExpenseForm = () => {
//   // const [form, setForm] = useState<FormState>({
//   //   title: "",
//   //   category: "",
//   //   price: "",
//   //   location: "",
//   //   datetime: new Date().toISOString(),
//   // });
//   const [form, setForm] = useState<FormState>(() => initFormFromExpense());


//   const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

//   const updateFormField = useCallback(<K extends keyof FormState>(
//     key: K, 
//     value: FormState[K]
//   ) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   }, []);

//   function initFormFromExpense(expense?: Expense): FormState {
//     return {
//       title: expense?.title || "",
//       category: expense?.category || "",
//       price: expense ? String(expense.price) : "",
//       location: expense?.location || "",
//       datetime: expense?.datetime || new Date().toISOString(),
//     };
//   };

//   const setFormFromExpense = useCallback((expense?: Expense) => {
//     setForm(initFormFromExpense(expense));
//     console.log("Вызов")
//   }, []);
//   // useEffect(() => {
//   //   setForm(initFormFromExpense(editingExpense ?? undefined));
//   // }, [editingExpense]);

//   const resetForm = useCallback(() => {
//     setForm(initFormFromExpense());
//     setEditingExpense(null);
//   }, [initFormFromExpense]);

//   return {
//     form,
//     editingExpense,
//     updateFormField,
//     // setFormFromExpense,
//     setEditingExpense,
//     resetForm,
//   };
// };


// hooks/useExpenseForm.ts
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
      category: expense?.category || "",
      price: expense ? String(expense.price) : "",
      location: expense?.location || "",
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