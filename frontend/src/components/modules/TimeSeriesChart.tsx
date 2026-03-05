// TimeSeriesChart.tsx
import { Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import { detectPeriod, groupByPeriod, type Period } from "../../utils/groupByPeriod";
import type { Expense } from "../../types";
import { aggregateToMaxPoints } from "../../utils/aggregate";

type Props = {
  expenses: Expense[];
};

export function TimeSeriesChart({ expenses }: Props) {
  if (expenses.length === 0) {
    return <p>Нет данных</p>;
  }

  // Автоопределяем период
  const period: Period = detectPeriod(expenses);

  // Группируем только в этом диапазоне
  const rawRows = groupByPeriod(expenses, period);
  const rows = aggregateToMaxPoints(rawRows, 20);

  const startLabel = rows.length > 0 ? rows[0].key.split("–")[0] : "";
  const endLabel = rows.length > 0 ? rows[rows.length - 1].key.split("–")[0] : "";

  const data: ChartData<"line"> = {
    labels: rows.map(r => r.key),
    datasets: [
      {
        label: "Сумма расходов",
        data: rows.map(r => r.total),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Количество транзакций",
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
                callbacks: {
                  label: ctx => `${ctx.dataset.label}: ${ctx.formattedValue}`,
                },
              },
              legend: {
                labels: { boxWidth: 3.5, boxHeight: 3.5 },
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                title: { display: true, text: "Сумма" },
                beginAtZero: true,
                position: "left",
              },
              y1: {
                title: { display: true, text: "Кол-во" },
                beginAtZero: true,
                position: "right",
                grid: { drawOnChartArea: false },
              },
            },
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
}
