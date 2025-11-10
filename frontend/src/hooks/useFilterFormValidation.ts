// useExpenseFormValidation.ts
import { useState, useCallback, useEffect } from "react";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  minPrice: string;
  maxPrice: string;
};

export function useFilterFormValidation(form: Props) {
  const [dateError, setDateError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  useEffect(() => {
    const min = parseFloat(form.minPrice);
    const max = parseFloat(form.maxPrice);
    setPriceError(!isNaN(min) && !isNaN(max) && min > max);
  }, [form.minPrice, form.maxPrice]);

  useEffect(() => {
    setDateError(Boolean(form.startDate && form.endDate && form.startDate > form.endDate));
  }, [form.startDate, form.endDate]);

  const isValid = useCallback(() => {
    return (
      !dateError && !priceError
    );
  }, [form]);

  const validateAndSubmit = useCallback(
    (onValid: () => void) => {
      if (isValid()) {
        onValid();
      }
    },
    [isValid]
  );

  return {
    dateError,
    priceError,
    isValid,
    validateAndSubmit,
  };
}