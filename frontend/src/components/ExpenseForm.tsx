// src/components/ExpenseForm.tsx
import { useState } from "react";
import { createExpense, updateExpense, type Expense } from "../api";


type Props = {
  initialData?: Expense;
  onCreated: () => void;
};

export const ExpenseForm = ({ initialData, onCreated }: Props) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    price: String(initialData?.price || ""),
    location: initialData?.location || "",
    datetime: initialData?.datetime || "",
  });

  // 2. Универсальный onChange для всех input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // 3. Отправка формы
  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.location || !form.datetime) return;
    try {
      if (initialData) {
        await updateExpense(initialData.id, { ...form, price: +form.price });
      } else {
        await createExpense({ ...form, price: +form.price });
      }
      console.log("Редактирование");
      onCreated();
    } catch (err) {console.error("Ошибка при сохранении:", err);}
  };

  // 4. JSX c Tailwind-классами
  return (
    <div className="bg-white p-4 rounded shadow-md">
      {/* <h3 className="text-lg font-medium mb-3">Новый расход</h3> */}
      <h3 className="text-lg font-medium mb-3">
      {initialData ? "Редактировать расход" : "Новый расход"}
      </h3>
      <div className="bg-red-500 p-4 text-white">
  Тест Tailwind - должен быть красный блок
</div>
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
        <input
          name="datetime"
          type="datetime-local"
          value={form.datetime}
          onChange={handleChange}
          className="col-span-1 sm:col-span-2 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
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
