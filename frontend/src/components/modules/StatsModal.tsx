// StatsModal.tsx
import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import type { Expense, GroupField } from "../../types";
import { groupExpenses } from "../../utils/groupExpenses";
import { StatsChart } from "./StatsChart";
import { StatsTable } from "./StatsTable";
import { buildChartData } from "../../utils/buildChartData";
import { TagIcon, RectangleStackIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { RadioGroup } from "../ui/RadioGroup";
import { TimeSeriesChart } from "./TimeSeriesChart";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

type Props = {
  onClose: () => void;
  expenses: Expense[];
  initialField?: GroupField;
};

const GROUP_OPTIONS: { value: GroupField; label: string; icon: React.ElementType }[] = [
  { value: "title", label: "Название", icon: TagIcon },
  { value: "category", label: "Категория", icon: RectangleStackIcon },
  { value: "location", label: "Место", icon: MapPinIcon },
];

export function StatsModal({ onClose, expenses, initialField = "category" }: Props) {
  const [field, setField] = useState<GroupField>(initialField);
  const [mode, setMode] = useState<"table" | "pie" | "time">("table");

  const rows = useMemo(() => groupExpenses(expenses, field), [expenses, field]);
  const grandTotal = useMemo(
    () => Math.round(rows.reduce((s, r) => s + r.total, 0) * 100) / 100, [rows]);
  const totalCount = useMemo(() => rows.reduce((s, r) => s + r.count, 0), [rows]);

  const threshold = 0.015;
  const chartData = useMemo(() => buildChartData(rows, grandTotal, threshold), [rows, grandTotal]);

  return (
    <div className="w-full bg-white rounded-lg ">
      <div className="relative mb-2 flex flex-wrap items-center gap-1">
        {mode !== "time" ? (
          <>
            <label className="text-sm text-center text-gray-600 w-full">
              Группировать по:
            </label>
            <div className="w-full rounded-lg p-2 mb-1 border border-gray-400">
            <RadioGroup<GroupField>
              options={GROUP_OPTIONS}
              selected={field}
              onChange={setField}
              orientation="horizontal"
            />
            </div>
          </>
        ) : (
          <div/> 
        )}

        <div
          className={`w-full ${
            mode === "time" ? "h-102" : "h-85"
          }`}
        >
          {rows.length > 0 ? (
            mode === "table" ? (
              <StatsTable field={field} rows={rows} grandTotal={grandTotal} totalCount={totalCount} />
            ) : mode === "pie" ? (
              <StatsChart chartData={chartData} />
            ) : (
              <TimeSeriesChart expenses={expenses} />
            )
          ) : (
            <p>Нет данных</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onClose} className="btn-base btn-cancel">
          Закрыть
        </button>
        {mode !== "table" && (
          <button onClick={() => setMode("table")} className="btn-base btn-confirm">
            Таблица
          </button>
        )}
        {mode !== "pie" && (
          <button onClick={() => setMode("pie")} className="btn-base btn-confirm">
            Диаграмма
          </button>
        )}
        {mode !== "time" && (
          <button onClick={() => setMode("time")} className="btn-base btn-confirm">
            График
          </button>
        )}
      </div>
    </div>
  );
}