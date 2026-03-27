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
import { TranslationKey, useTranslation } from "../../hooks/useTranslation";

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

const GROUP_OPTIONS: { value: GroupField; label: TranslationKey; icon: React.ElementType }[] = [
  { value: "title", label: "title", icon: TagIcon },
  { value: "category", label: "category", icon: RectangleStackIcon },
  { value: "location", label: "place", icon: MapPinIcon },
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

  const { t } = useTranslation()

  return (
    <div className="w-full bg-(--bg-secondary) rounded-lg ">
      <div className="relative mb-2 flex flex-wrap items-center">
        {mode !== "time" ? (
          <>
            <RadioGroup<GroupField>
              heading="group_by"
              options={GROUP_OPTIONS}
              selected={field}
              onChange={setField}
              orientation="horizontal"
            />
          </>
        ) : (
          <div/> 
        )}

        <div
          className={`w-full ${
            mode === "time" ? "h-106" : "h-84"
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
            <div className={`w-full flex items-center justify-center
              ${
                mode === "time" ? "h-108" : "h-64"
              }
            `}>
              <p className="upper-text">{t('no_data')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onClose} className="btn-base btn-cancel">
          {t('cancel')}
        </button>
        {mode !== "table" && (
          <button onClick={() => setMode("table")} className="btn-base btn-confirm">
            {t('table')}
          </button>
        )}
        {mode !== "pie" && (
          <button onClick={() => setMode("pie")} className="btn-base btn-confirm">
            {t('chart')}
          </button>
        )}
        {mode !== "time" && (
          <button onClick={() => setMode("time")} className="btn-base btn-confirm">
            {t('graph')}
          </button>
        )}
      </div>
    </div>
  );
}