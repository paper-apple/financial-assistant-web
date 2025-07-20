// src/components/ExpenseForm.tsx
import { useState } from "react";
import { forwardRef } from "react";
import { createExpense, updateExpense, type Expense } from "../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";


type Props = {
  initialData?: Expense;
  onCreated?: (created: Expense) => void;
  onUpdated?: (updated: Expense) => void;
};

export const ExpenseForm = ({
  initialData,
  onCreated,
  onUpdated,
}: Props) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    price: String(initialData?.price || ""),
    location: initialData?.location || "",
    datetime: initialData?.datetime || new Date().toISOString(),
  });

  // 2. Универсальный onChange для всех input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let sanitizedValue = value;

    if (name === "price") {
      sanitizedValue = value
        .replace(/[^\d.,]/g, "")      // разрешаем только цифры, точку и запятую
        .replace(",", ".")            // нормализуем запятую
        .replace(/^(\d*\.\d{0,2}).*$/, "$1"); // ограничиваем до 2 знаков после точки
    }

    setForm((f) => ({ ...f, [name]: sanitizedValue }));
  };


  // 3. Отправка формы
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

  const [wasSubmitted, setWasSubmitted] = useState(false);

  const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, placeholder }, ref) => (
  <input
    type="text"
    readOnly
    onClick={onClick}
    ref={ref}
    value={value}
    placeholder={placeholder}
    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
  />
  ));

  // 4. JSX c Tailwind-классами
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-0 gap-2">  
        <div className="mb-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Название
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Название"
            className={`border rounded px-3 py-2 focus:ring-2 ${
              wasSubmitted && !form.title.trim()
                ? "border-red-500 ring-red-300"
                : "focus:ring-blue-400"}`}/>
        </div>
        <div className="mb-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Категория
          </label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Категория"
            className={`border rounded px-3 py-2 focus:ring-2 ${
              wasSubmitted && !form.category.trim()
                ? "border-red-500 ring-red-300"
                : "focus:ring-blue-400"}`}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Стоимость
          </label>
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
                : "focus:ring-blue-400"}`}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Место
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Место"
            className={`border rounded px-3 py-2 focus:ring-2 ${
              wasSubmitted && !form.location.trim()
                ? "border-red-500 ring-red-300"
                : "focus:ring-blue-400"}`}
          />
      </div>
        <div className="mb-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Дата
          </label>
          <DatePicker
            selected={form.datetime ? new Date(form.datetime) : null}
            onChange={(date) =>
              setForm((f) => ({ ...f, datetime: date?.toISOString() || "" }))
            }
            showTimeSelect
            dateFormat="dd.MM.yyyy HH:mm"
            locale={ru}
            placeholderText="Выберите дату и время"
            customInput={<CustomInput placeholder="Дата и время" />}
            popperPlacement="top"
          />
        </div>
      </div>
      <div className="min-h-[1.25rem] text-sm text-red-500 mt-1">
        {wasSubmitted && 
        (!form.title.trim() || !form.category.trim() || !form.price.trim() || !form.location.trim())
        && "Заполните поля"}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-3 w-full bg-red-400 hover:bg-blue-600 text-white py-2 rounded"
      >
        {initialData ? "Сохранить" : "Добавить расход"}
      </button>
    </div>
  );
};
