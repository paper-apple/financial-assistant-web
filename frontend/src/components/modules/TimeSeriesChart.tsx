// TimeSeriesChart.tsx
import { Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import { detectPeriod, groupByPeriod, type Period } from "../../utils/groupByPeriod";
import type { Expense } from "../../types";
import { aggregateToMaxPoints } from "../../utils/aggregate";
import { getColor } from "../../hooks/useGetComputedStyle";
import { useTranslation } from "../../hooks/useTranslation";

type Props = {
  expenses: Expense[];
};

export function TimeSeriesChart({ expenses }: Props) {
  const { t } = useTranslation()

  if (expenses.length === 0) {
    return <p>{t('no_data')}</p>;
  }

  // Автоопределение периода
  const period: Period = detectPeriod(expenses);

  // Группировака в диапазоне
  const rawRows = groupByPeriod(expenses, period);
  const rows = aggregateToMaxPoints(rawRows, 20);

  const startLabel = rows.length > 0 ? rows[0].key.split("–")[0] : "";
  const endLabel = rows.length > 0 ? rows[rows.length - 1].key.split("–")[0] : "";
  
  const data: ChartData<"line"> = {
    labels: rows.map(r => r.key),
    datasets: [
      {
        label: t('expence_amount'),
        data: rows.map(r => r.total),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
        yAxisID: "y",
      },
      {
        label: t('number_of_transactions'),
        data: rows.map(r => r.count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        yAxisID: "y1",
      },
    ],
  };

  return (
    <div className="w-full h-100 flex flex-col">
      <div className="flex-1">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            layout: {
              padding: {
                top: 0,
              },
            },
            plugins: {
              tooltip: {
                titleColor: getColor('--text'),
                bodyColor: getColor('--text'),
                backgroundColor: `rgba(${getColor('--tip-bg')}, 0.7)`,
                callbacks: {
                  label: ctx => `${ctx.dataset.label}: ${ctx.formattedValue}`,
                },
              },
              legend: {
                labels: { boxWidth: 3.5, boxHeight: 3.5, color: getColor('--text') },
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                title: { display: true, text: t('sum'), color: getColor('--text') },
                beginAtZero: true,
                position: "left",
                ticks: {
                  color: getColor('--text'),
                },
                grid: {
                  color: getColor('--tip-text'),
                },
                border: {
                  color: getColor('--tip-text'),
                  width: 1,
                },
              },
              y1: {
                title: { display: true, text: t('quantity'), color: getColor('--text') },
                beginAtZero: true,
                position: "right",
                grid: { drawOnChartArea: false },
                ticks: {
                  color: getColor('--text'),
                },
                border: {
                  color: getColor('--tip-text'),
                  width: 1,
                },
              },
            },
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-(--text) mt-1">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
}
