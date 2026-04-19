// StatsModal.tsx
import { useMemo } from "react";
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
import type { Expense, GroupField, StatsState } from "../../types";
import { groupExpenses } from "../../utils/groupExpenses";
import { StatsChart } from "./StatsChart";
import { StatsTable } from "./StatsTable";
import { TagIcon, RectangleStackIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { RadioGroup } from "../ui/RadioGroup";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TranslationKey, useTranslation } from "../../hooks/useTranslation";
import { useChartData } from "../../hooks/useChartData";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  onClose: () => void;
  expenses: Expense[];
  statsState: StatsState;
};

const GROUP_OPTIONS: { value: GroupField; label: TranslationKey; icon: React.ElementType }[] = [
  { value: "title", label: "title", icon: TagIcon },
  { value: "category", label: "category", icon: RectangleStackIcon },
  { value: "location", label: "place", icon: MapPinIcon },
];

export function StatsModal({ onClose, expenses, statsState }: Props) {
  const { t } = useTranslation()

  const { statsField, applyStatsField, statsMode, applyStatsMode } = statsState

  const rows = useMemo(() => groupExpenses(expenses, statsField), [expenses, statsField]);

  const grandTotal = useMemo(
    () => Math.round(rows.reduce((s, r) => s + r.total, 0) * 100) / 100, [rows]);

  const totalCount = useMemo(() => rows.reduce((s, r) => s + r.count, 0), [rows]);

  const threshold = 0.015;

  const chartData = useChartData(rows, grandTotal, threshold)

  return (
    <div className="w-full bg-(--bg-secondary) rounded-lg ">
      <div className="relative mb-2 flex flex-wrap items-center">
        {statsMode !== "time" ? (
          <>
            <RadioGroup<GroupField>
              heading="group_by"
              options={GROUP_OPTIONS}
              selected={statsField}
              onChange={applyStatsField}
              orientation="horizontal"
            />
          </>
        ) : (
          <div/> 
        )}

        <div
          className={`w-full ${
            statsMode === "time" ? "h-106" : "h-84"
          }`}
        >
          {rows.length > 0 ? (
            statsMode === "table" ? (
              <StatsTable field={statsField} rows={rows} grandTotal={grandTotal} totalCount={totalCount} />
            ) : statsMode === "pie" ? (
              <StatsChart chartData={chartData} />
            ) : (
              <TimeSeriesChart expenses={expenses} />
            )
          ) : (
            <div className={`w-full flex items-center justify-center
              ${
                statsMode === "time" ? "h-108" : "h-64"
              }
            `}>
              <p className="upper-text">{t('no_data')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={onClose} className="btn-base btn-cancel">
          {t('cancel')}
        </button>
        {statsMode !== "table" && (
          <button onClick={() => applyStatsMode("table")} className="btn-base btn-confirm">
            {t('table')}
          </button>
        )}
        {statsMode !== "pie" && (
          <button onClick={() => applyStatsMode("pie")} className="btn-base btn-confirm">
            {t('chart')}
          </button>
        )}
        {statsMode !== "time" && (
          <button onClick={() => applyStatsMode("time")} className="btn-base btn-confirm">
            {t('graph')}
          </button>
        )}
      </div>
    </div>
  );
}