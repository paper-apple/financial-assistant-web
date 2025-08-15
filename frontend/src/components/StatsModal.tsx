// src/components/StatsModal.tsx
import { useMemo, useState } from "react";
import { type Expense } from "../types";
import { groupExpenses, type GroupField } from "../utils/groupExpenses";

type Props = {
  onClose?: () => void;
  expenses: Expense[];               // сюда передаёшь отображённые карточки (filteredExpenses)
  initialField?: GroupField;         // необязательный дефолт
  currency?: string;                 // "BYN" по умолчанию
};

const groupFieldLabels: Record<GroupField, string> = {
  title: "Название",
  category: "Категория",
  location: "Место",
};

export function StatsModal({
  onClose,
  expenses,
  initialField = "category",
  currency = "BYN",
}: Props) {
  const [field, setField] = useState<GroupField>(initialField);

  const rows = useMemo(() => groupExpenses(expenses, field), [expenses, field]);

  const totalCount = useMemo(() => rows.reduce((s, r) => s + r.count, 0), [rows]);
  const grandTotal = useMemo(() => rows.reduce((s, r) => s + r.total, 0), [rows]);

  const money = (n: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Статистика по корзине</h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {/* Controls */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium">Группировать по:</label>
            <select
              value={field}
              onChange={e => setField(e.target.value as GroupField)}
              className="border rounded px-3 py-2"
            >
              <option value="title">{groupFieldLabels.title}</option>
              <option value="category">{groupFieldLabels.category}</option>
              <option value="location">{groupFieldLabels.location}</option>
            </select>

            <div className="ml-auto text-sm text-gray-600">
              Покупок: <span className="font-medium">{totalCount}</span>
              <span className="mx-2">•</span>
              Сумма: <span className="font-medium">{money(grandTotal)}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto max-h-[60vh] border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 border-b w-[55%]">Группа ({groupFieldLabels[field]})</th>
                  <th className="text-right p-3 border-b w-[15%]">Кол-во</th>
                  <th className="text-right p-3 border-b w-[30%]">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-gray-500">
                      Нет данных для выбранных фильтров
                    </td>
                  </tr>
                ) : (
                  rows.map(row => (
                    <tr key={row.key} className="odd:bg-white even:bg-gray-50">
                      <td className="p-3 border-b">{row.key}</td>
                      <td className="p-3 text-right border-b">{row.count}</td>
                      <td className="p-3 text-right border-b">{money(row.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {rows.length > 0 && (
                <tfoot className="bg-gray-50 sticky bottom-0">
                  <tr>
                    <td className="p-3 font-medium">Итого</td>
                    <td className="p-3 text-right font-medium">{totalCount}</td>
                    <td className="p-3 text-right font-medium">{money(grandTotal)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
