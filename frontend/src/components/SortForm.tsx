// src/components/SortForm.tsx
import { useState } from "react";
import { type SortParams } from "../types";

type Props = {
  initialValues: SortParams;
  onApply:       (sort: SortParams) => void;
  onClose:       () => void;
};

export function SortForm({ initialValues, onApply, onClose }: Props) {
  const [field, setField]         = useState<SortParams["field"]>(initialValues.field);
  const [direction, setDirection] = useState<SortParams["direction"]>(
    initialValues.direction
  );

  const handleApply = () => {
    onApply({ field, direction })
    onClose()
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Сортировка</h2>

      {/* Выбор поля */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Поле для сортировки</label>
        <select
          value={field}
          onChange={e => setField(e.target.value as SortParams["field"])}
          className="w-full border-gray-300 border rounded px-3 py-2"
        >
          <option value="title">Название</option>
          <option value="category">Категория</option>
          <option value="price">Цена</option>
          <option value="location">Место</option>
          <option value="datetime">Дата</option>
        </select>
      </div>

      {/* Направление */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Направление</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={direction === "asc"}
              onChange={() => setDirection("asc")}
            />
            По возрастанию
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={direction === "desc"}
              onChange={() => setDirection("desc")}
            />
            По убыванию
          </label>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Отмена
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Применить
        </button>
      </div>
    </div>
  );
}
