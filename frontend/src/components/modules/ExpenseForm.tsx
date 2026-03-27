// ExpenseForm.tsx
import { createExpense, updateExpense } from "../../api";
import type { Expense, FormState, Modals } from "../../types";
import { useKeywordSuggestions } from "../../hooks/useKeywordSuggestions";
import { useExpenseFormValidation } from "../../hooks/useExpenseFormValidation";
import { sanitizePrice } from "../../utils/sanitizePrice";
import { FormField } from "../ui/FormField";
import {
  TagIcon,
  RectangleStackIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import {ErrorBar} from "./ErrorBar"
import { TranslationKey, useTranslation } from "../../hooks/useTranslation";

type Props = {
  form: FormState;
  initialData?: Expense;
  onCreated: (created: Expense) => void;
  onUpdated?: (updated: Expense) => void;
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onModalOpen: (modal: keyof Modals) => void;
  onModalClose: () => void;
};

const FIELDS_CONFIG: { key: keyof FormState; label: TranslationKey; testId: string, icon: React.ElementType }[] = [
  { key: "title", label: "title", testId: 'input-title', icon: TagIcon},
  { key: "category", label: "category", testId: 'input-category', icon: RectangleStackIcon },
  { key: "price", label: "cost", testId: 'input-price', icon: CurrencyDollarIcon },
  { key: "location", label: "place", testId: 'input-location', icon: MapPinIcon },
];

export const ExpenseForm = ({
  form,
  initialData,
  onCreated,
  onUpdated,
  updateField,
  onModalOpen: openModal,
  onModalClose: closeModal,
}: Props) => {
  const suggestionsMap = {
    title: useKeywordSuggestions({ field: "title", input: form.title }),
    category: useKeywordSuggestions({ field: "category", input: form.category }),
    location: useKeywordSuggestions({ field: "location", input: form.location }),
  };

  const { getFieldError, validateAndSubmit, isValid, wasSubmitted } =
    useExpenseFormValidation(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const finalValue = name === "price" ? sanitizePrice(value) : value.slice(0, 30);
    updateField(name as keyof FormState, finalValue);
  };

  const [showErrorTooltip, setShowErrorTooltip] = useState(false);

  const handleAddExpense = async () => {
    if (!isValid()) {
      setShowErrorTooltip(true);
    }
    validateAndSubmit(async () => {
      try {
        const created = await createExpense({
          ...form,
          price: +form.price,
        });
        onCreated(created);
      } catch (err) {
        console.error("Ошибка при сохранении:", err);
      }
    });
  };

  const handleEditExpense = async () => {
    validateAndSubmit(async () => {
      try {
        if (initialData && onUpdated) {
          const updated = await updateExpense(initialData.id, {
            ...form,
            price: +form.price,
          });
          onUpdated(updated);
        }
      } catch (err) {
        console.error("Ошибка при сохранении:", err);
      }
    });
  };

  useEffect(() => {
    if (showErrorTooltip) {
      const timer = setTimeout(() => {
        setShowErrorTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showErrorTooltip]);
  
  const { t } = useTranslation()

  return (
    <div>
      <div className="grid grid-cols-1 gap-2">
        {FIELDS_CONFIG.map(({ key, label, testId, icon }) => {
          const sugg = suggestionsMap[key as keyof typeof suggestionsMap];
          return (
            <FormField
              key={key}
              label={label}
              name={key}
              testId={testId}
              value={form[key]}
              onChange={handleChange}
              error={getFieldError(key)}
              suggestions={sugg?.suggestions}
              onSuggestionSelect={
                sugg
                  ? val => {
                      updateField(key, val);
                      sugg.clearSuggestions();
                    }
                  : undefined
              }
              icon={icon}
            />
          );
        })}
        <div>
          <div>
            <FormField
              label="date"
              testId="button-date"
              value={
                form.datetime
                  ? new Date(form.datetime).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(',', '')
                  : ""
              }
              readOnly
              calendarOpen={() => openModal("calendar")}
              icon={CalendarDaysIcon}
            />
          </div>
        </div>
      </div>
      <div className="relative">
        {showErrorTooltip && (
          <div>
            <ErrorBar errorText="error_empty_fields"/>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={closeModal}
          className="btn-base btn-cancel"
        >
          {t("cancel")}
        </button>
        {onUpdated && (
          <button onClick={handleEditExpense} className={`btn-base w-[100px]
          ${ isValid() ? "btn-confirm" : "btn-disabled"}`}>
            {t("change")}
          </button>
        )}
        <button onClick={handleAddExpense} className={`btn-base w-[100px] 
          ${ isValid() ? "btn-confirm" : "btn-disabled"}`}>
            {t("create")}
        </button>
      </div>
    </div>
  );
};