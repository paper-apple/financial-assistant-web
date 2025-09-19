// hooks/useExpenseFormValidation.ts
import type { FilterParams, FormState } from "../types";
import { useState, useCallback, useEffect } from "react";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  minPrice: string;
  maxPrice: string;
};

export function useFilterFormValidation(form: Props) {
  const [wasSubmitted, setWasSubmitted] = useState(false);
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);
  // const [minPrice, setMinPrice] = useState('');
  // const [maxPrice, setMaxPrice] = useState('');
  const [dateError, setDateError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  // Валидация цен
  useEffect(() => {
    const min = parseFloat(form.minPrice);
    const max = parseFloat(form.maxPrice);
    setPriceError(!isNaN(min) && !isNaN(max) && min > max);
  }, [form.minPrice, form.maxPrice]);

  // Валидация дат
  useEffect(() => {
    setDateError(Boolean(form.startDate && form.endDate && form.startDate > form.endDate));
  }, [form.startDate, form.endDate]);

  // function validateDate() {
  //   return (Boolean(form.startDate && form.endDate && form.startDate > form.endDate))
  // };

  // function validatePrice() {
  //   const min = parseFloat(form.minPrice);
  //   const max = parseFloat(form.maxPrice);
  //   return (Boolean(!isNaN(min) && !isNaN(max) && min > max));
  //   // return (Boolean(form.startDate && form.endDate && form.startDate > form.endDate))
  // };

  const isValid = useCallback(() => {
    return (
      !dateError && !priceError
    );
  }, [form]);

  // const isValid = useCallback(() => {
  //   return (
  //     form.title.trim() &&
  //     form.category.trim() &&
  //     form.price.trim() &&
  //     form.location.trim()
  //   );
  // }, [form]);

  // const getFieldError = useCallback(
  //   (field: keyof FormState) => {
  //     if (!wasSubmitted) return false;
  //     // if (!form[field].trim()) return "Заполните поле";
  //     if (!form[field].trim()) return true;
  //     return false;
  //   },
  //   [form, wasSubmitted]
  // );

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
    // wasSubmitted,
    // setWasSubmitted,
    dateError,
    priceError,
    isValid,
    // getFieldError,
    validateAndSubmit,
  };
}
