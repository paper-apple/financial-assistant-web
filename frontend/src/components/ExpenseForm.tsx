// src/components/ExpenseForm.tsx
import { createExpense, updateExpense } from "../api";
import type { Expense, FormState, Modals } from "../types";
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
  onCalendaropen: () => void;
  onModalClose: () => void;
};

const FIELDS_CONFIG: { key: keyof FormState; label: string; placeholder: string }[] = [
  { key: "title", label: "Название", placeholder: "Введите название расхода" },
  { key: "category", label: "Категория", placeholder: "Введите категорию расхода" },
  { key: "price", label: "Стоимость", placeholder: "Введите стоимость расхода" },
  { key: "location", label: "Место", placeholder: "Введите место оплаты расхода" },
];

export const ExpenseForm = ({
  form,
  initialData,
  onCreated,
  onUpdated,
  updateField,
  onModalClose: closeModal,
  onCalendaropen: openCalendar,
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
        {FIELDS_CONFIG.map(({ key, label, placeholder }) => {
          const sugg = suggestionsMap[key as keyof typeof suggestionsMap];
          return (
            <FormField
              key={key}
              label={label}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={placeholder}
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

        {/* Дата */}
        <div className="mb-1">
          <label className="block text-sm font-medium mb-1">Дата</label>
          <button
            // onClick={onCalendarOpen}
            onClick={openCalendar}
            className="w-full border rounded px-3 py-1 text-left"
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

      {/* Кнопка */}
      <div className="flex justify-end gap-2">
        <button
          onClick={closeModal}
          className="w-full px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Отменить
        </button>
         <button onClick={handleSubmit} className={`w-full px-4 py-2 border rounded text-sm text-white 
          ${ isValid() ? "bg-blue-300 hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-200"}`}>
            Применить
        </button>
        {/* <button
          onClick={handleSubmit}
          className="mt-3 w-full text-sm bg-blue-300 hover:bg-blue-500 text-white py-2 border border-blue-300 rounded-md"
        >
          {initialData ? "Сохранить" : "Добавить"}
        </button> */}
      </div>
    </div>
  );
};
