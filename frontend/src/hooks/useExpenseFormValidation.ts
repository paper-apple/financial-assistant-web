// useExpenseFormValidation.ts
import type { FormState } from "../types";
import { useState, useCallback } from "react";

export function useExpenseFormValidation(form: FormState) {
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const isValid = useCallback(() => {
    return (
      form.title.trim() &&
      form.category.trim() &&
      form.price.trim() &&
      form.location.trim()
    );
  }, [form]);

  const getFieldError = useCallback(
    (field: keyof FormState) => {
      if (!wasSubmitted) return false;
      if (!form[field].trim()) return true;
      return false;
    },
    [form, wasSubmitted]
  );

  const validateAndSubmit = useCallback(
    (onValid: () => void) => {
      setWasSubmitted(true);
      if (isValid()) {
        onValid();
      }
    },
    [isValid]
  );

  return {
    wasSubmitted,
    setWasSubmitted,
    isValid,
    getFieldError,
    validateAndSubmit,
  };
}