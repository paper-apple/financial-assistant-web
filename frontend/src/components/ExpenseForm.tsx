// src/components/ExpenseForm.tsx
import { useState } from "react";
import { createExpense, updateExpense } from "../api";
import type { Expense, FormState } from "../types"
import "react-datepicker/dist/react-datepicker.css";
import { useKeywordSuggestions } from "../hooks/useKeywordSuggestions";

type Props = {
  form: FormState
  initialData?: Expense
  onCreated?: (created: Expense) => void
  onUpdated?: (updated: Expense) => void
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onOpen: () => void
};

export const ExpenseForm = ({
  form,
  initialData,
  onCreated,
  onUpdated,
  updateField,
  onOpen,
}: Props) => {
  const [wasSubmitted, setWasSubmitted] = useState(false);

  // Подсказки для каждого поля
  const { suggestions: titleSuggestions, clearSuggestions: clearTitle } =
    useKeywordSuggestions({ field: "title", input: form.title });
  const { suggestions: categorySuggestions, clearSuggestions: clearCategory } =
    useKeywordSuggestions({ field: "category", input: form.category });
  const { suggestions: locationSuggestions, clearSuggestions: clearLocation } =
    useKeywordSuggestions({ field: "location", input: form.location });

  // Универсальный onChange для всех input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let sanitizedValue = value;

    if (name === "price") {
      sanitizedValue = value
        .replace(/[^\d.,]/g, "")      // разрешаем только цифры, точку и запятую
        .replace(",", ".")            // нормализуем запятую
        .replace(/^(\d*\.\d{0,2}).*$/, "$1"); // ограничиваем до 2 знаков после точки
    }
    updateField(name as keyof FormState, sanitizedValue);
  };


  // Отправка формы
  const handleSubmit = async () => {
    setWasSubmitted(true);

    if (!form.title || !form.category || !form.price || !form.location) return; // простая валидация

    try {
      if (initialData && onUpdated) {
        const updated = await updateExpense(
          initialData.id,
          { ...form, price: +form.price }
        );
        onUpdated(updated);
      } else if (!initialData && onCreated) {
        const created = await createExpense(
          { ...form, price: +form.price }
        );
        onCreated(created);
      }
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
    }
  };

  const renderSuggestions = (
    list: string[],
    onSelect: (value: string) => void
  ) =>
    list.length > 0 && (
      <ul className="absolute bg-white border rounded shadow w-full z-10">
        {list.map((s) => (
          <li
            key={s}
            onClick={() => onSelect(s)}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {s}
          </li>
        ))}
      </ul>
    );

  // return (
  //   <div className="bg-white p-4 rounded shadow-md">
  //     <div className="grid grid-cols-1 sm:grid-cols-0 gap-2">  
  //       <div className="mb-2">
  //         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
  //           Название
  //         </label>
  //         <input
  //           name="title"
  //           value={form.title}
  //           onChange={handleChange}
  //           placeholder="Название"
  //           className={`border rounded px-3 py-2 focus:ring-2 ${
  //             wasSubmitted && !form.title.trim()
  //               ? "border-red-500 ring-red-300"
  //               : "focus:ring-blue-400"}`}/>
  //       </div>
  //       <div className="mb-2">
  //         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
  //           Категория
  //         </label>
  //         <input
  //           name="category"
  //           value={form.category}
  //           onChange={handleChange}
  //           placeholder="Категория"
  //           className={`border rounded px-3 py-2 focus:ring-2 ${
  //             wasSubmitted && !form.category.trim()
  //               ? "border-red-500 ring-red-300"
  //               : "focus:ring-blue-400"}`}
  //         />
  //       </div>
  //       <div className="mb-2">
  //         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
  //           Стоимость
  //         </label>
  //         <input
  //           name="price"
  //           type="text"
  //           inputMode="decimal"
  //           pattern="[0-9]*"
  //           value={form.price}
  //           onChange={handleChange}
  //           placeholder="Сумма"
  //           className={`border rounded px-3 py-2 focus:ring-2 ${
  //             wasSubmitted && !form.price.trim()
  //               ? "border-red-500 ring-red-300"
  //               : "focus:ring-blue-400"}`}
  //         />
  //       </div>
  //       <div className="mb-2">
  //         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
  //           Место
  //         </label>
  //         <input
  //           name="location"
  //           value={form.location}
  //           onChange={handleChange}
  //           placeholder="Место"
  //           className={`border rounded px-3 py-2 focus:ring-2 ${
  //             wasSubmitted && !form.location.trim()
  //               ? "border-red-500 ring-red-300"
  //               : "focus:ring-blue-400"}`}
  //         />
  //       </div>
  //       <div className="mb-2">
  //         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
  //           Дата
  //         </label>
  //         <button
  //           onClick={onOpen}
  //           className="w-full border rounded px-3 py-2 text-left"
  //           data-testid="calendar-button"
  //         >
  //           {form.datetime
  //             ? new Date(form.datetime).toLocaleString("ru-RU", {
  //                 day: "2-digit",
  //                 month: "2-digit",
  //                 year: "numeric",
  //                 hour: "2-digit",
  //                 minute: "2-digit",
  //               })
  //             : "Выберите дату и время"}
  //         </button>
  //       </div>
  //     </div>
  //     <div className="min-h-[1.25rem] text-sm text-red-500 mt-1">
  //       {wasSubmitted && 
  //       (!form.title.trim() || !form.category.trim() || !form.price.trim() || !form.location.trim())
  //       && "Заполните поля"}
  //     </div>
  //     <button
  //       onClick={handleSubmit}
  //       className="mt-3 w-full bg-red-400 hover:bg-blue-600 text-white py-2 rounded"
  //     >
  //       {initialData ? "Сохранить" : "Добавить"}
  //     </button>
  //   </div>
  // );


  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="grid grid-cols-1 gap-2">
        {/* Название */}
        <div className="mb-2 relative">
          <label className="block text-sm font-medium mb-1">Название</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Название"
            className={`border rounded px-3 py-2 focus:ring-2 ${
              wasSubmitted && !form.title.trim()
                ? "border-red-500 ring-red-300"
                : "focus:ring-blue-400"
            }`}
          />
          {renderSuggestions(titleSuggestions, (val) => {
            updateField("title", val);
            clearTitle();
          })}
        </div>

        {/* Категория */}
        <div className="mb-2 relative">
          <label className="block text-sm font-medium mb-1">Категория</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Категория"
            className={`border rounded px-3 py-2 focus:ring-2 ${
              wasSubmitted && !form.category.trim()
                ? "border-red-500 ring-red-300"
                : "focus:ring-blue-400"
            }`}
          />
          {renderSuggestions(categorySuggestions, (val) => {
            updateField("category", val);
            clearCategory();
          })}
        </div>

        {/* Цена */}
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Стоимость</label>
          <input
            name="price"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={form.price}
            onChange={handleChange}
            placeholder="Сумма"
            className={`border rounded px-3 py-2 focus:ring-2 ${
              wasSubmitted && !form.price.trim()
                ? "border-red-500 ring-red-300"
                : "focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Локация */}
        <div className="mb-2 relative">
          <label className="block text-sm font-medium mb-1">Место</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Место"
            className={`border rounded px-3 py-2 focus:ring-2 ${
              wasSubmitted && !form.location.trim()
                ? "border-red-500 ring-red-300"
                : "focus:ring-blue-400"
            }`}
          />
          {renderSuggestions(locationSuggestions, (val) => {
            updateField("location", val);
            clearLocation();
          })}
        </div>

        {/* Дата */}
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Дата</label>
          <button
            onClick={onOpen}
            className="w-full border rounded px-3 py-2 text-left"
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

      {/* Ошибки */}
      <div className="min-h-[1.25rem] text-sm text-red-500 mt-1">
        {wasSubmitted &&
          (!form.title.trim() ||
            !form.category.trim() ||
            !form.price.trim() ||
            !form.location.trim()) &&
          "Заполните поля"}
      </div>

      {/* Кнопка */}
      <button
        onClick={handleSubmit}
        className="mt-3 w-full bg-red-400 hover:bg-blue-600 text-white py-2 rounded"
      >
        {initialData ? "Сохранить" : "Добавить"}
      </button>
    </div>
  );
};
