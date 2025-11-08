// ExpenseForm.tsx
import { createExpense, updateExpense } from "../api";
import type { Expense, FormState } from "../types";
import { useKeywordSuggestions } from "../hooks/useKeywordSuggestions";
import { useExpenseFormValidation } from "../hooks/useExpenseFormValidation";
import { sanitizePrice } from "../utils/sanitizePrice";
import { FormField } from "./ui/FormField";

type Props = {
  form: FormState;
  initialData?: Expense;
  onCreated?: (created: Expense) => void;
  onUpdated?: (updated: Expense) => void;
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onCalendarOpen: () => void;
  onModalClose: () => void;
};

const FIELDS_CONFIG: { key: keyof FormState; label: string; placeholder: string, testId: string }[] = [
  { key: "title", label: "Название", placeholder: "...введите название расхода", testId: 'input-title'},
  { key: "category", label: "Категория", placeholder: "...введите категорию расхода", testId: 'input-category' },
  { key: "price", label: "Стоимость", placeholder: "...введите стоимость расхода", testId: 'input-price' },
  { key: "location", label: "Место", placeholder: "...введите место оплаты расхода", testId: 'input-location' },
];

export const ExpenseForm = ({
  form,
  initialData,
  onCreated,
  onUpdated,
  updateField,
  onModalClose: closeModal,
  onCalendarOpen: openCalendar,
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

  const handleSubmit = async () => {
    validateAndSubmit(async () => {
      try {
        if (initialData && onUpdated) {
          const updated = await updateExpense(initialData.id, {
            ...form,
            price: +form.price,
          });
          onUpdated(updated);
        } else if (!initialData && onCreated) {
          const created = await createExpense({
            ...form,
            price: +form.price,
          });
          onCreated(created);
        }
      } catch (err) {
        console.error("Ошибка при сохранении:", err);
      }
    });
  };
  
  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 gap-2">
        {FIELDS_CONFIG.map(({ key, label, placeholder, testId }) => {
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
            />
          );
        })}

        <div>
          <label className="label-text mb-2">Дата</label>
          <button
            onClick={openCalendar}
            className="w-full border border-neutral-500 rounded px-3 py-1 text-left"
            data-testid="button-date"
          >
            {form.datetime
              ? new Date(form.datetime).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Выберите дату и время"}
          </button>
        </div>
      </div>

      <div className="my-1 min-h-[26px] max-h-[26px] overflow-y-auto text-red-400 text-center">
        {wasSubmitted && !isValid() && (
          <p>Заполните поля</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={closeModal}
          className="btn-base btn-cancel"
        >
          Отменить
        </button>
         <button onClick={handleSubmit} className={`btn-base
          ${ isValid() ? "btn-confirm" : "btn-disabled"}`}>
          Применить
        </button>
      </div>
    </div>
  );
};