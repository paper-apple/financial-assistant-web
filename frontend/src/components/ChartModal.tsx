import { useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { Expense } from "../types";
import { groupExpenses, type GroupField } from "../utils/groupExpenses";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  onClose: () => void;
  expenses: Expense[];
  initialField?: GroupField;
  currency?: string;
};

const groupFieldLabels: Record<GroupField, string> = {
  title: "Название",
  category: "Категория",
  location: "Место",
};

export function StatsChartModal({
  onClose,
  expenses,
  initialField = "category",
  currency = "BYN",
}: Props) {
  const [field, setField] = useState<GroupField>(initialField);

  const rows = useMemo(() => groupExpenses(expenses, field), [expenses, field]);
  const grandTotal = useMemo(() => rows.reduce((s, r) => s + r.total, 0), [rows]);

  const chartData = {
    labels: rows.map(r => r.key),
    datasets: [
      {
        label: `Сумма (${currency})`,
        data: rows.map(r => r.total),
        backgroundColor: [
          "#3b82f6", // blue
          "#10b981", // green
          "#f59e0b", // amber
          "#ef4444", // red
          "#8b5cf6", // violet
          "#06b6d4", // cyan
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Диаграмма по корзине</h2>
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
            Сумма: <span className="font-medium">
              {new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
              }).format(grandTotal)}
            </span>
          </div>
        </div>

        {/* Chart */}
        {rows.length > 0 ? (
          <Pie data={chartData} />
        ) : (
          <div className="p-6 text-center text-gray-500">
            Нет данных для выбранных фильтров
          </div>
        )}
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
  );
}
