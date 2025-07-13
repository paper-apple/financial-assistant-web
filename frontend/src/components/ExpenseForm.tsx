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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // 3. Отправка формы
  const handleSubmit = async () => {
    if (!form.title) return; // простая валидация

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Название"
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Категория"
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Сумма"
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Место"
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
        />
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
      <button
        onClick={handleSubmit}
        className="mt-3 w-full bg-red-400 hover:bg-blue-600 text-white py-2 rounded"
      >
        {initialData ? "Сохранить" : "Добавить расход"}
      </button>
    </div>
  );
};
