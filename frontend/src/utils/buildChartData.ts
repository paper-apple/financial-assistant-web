// lib/buildChartData.ts
import type { ChartData } from "chart.js";

type Row = { key: string; total: number; count: number };

export function buildChartData(
  rows: Row[],
  grandTotal: number,
  threshold = 0.02
): ChartData<"pie", number[], string> {
  // if (grandTotal === 0) {
  //   return { labels: [], datasets: [] };
  // }

  const major: Row[] = [];
  let otherTotal = 0;

  for (const r of rows) {
    const percent = r.total / grandTotal;
    if (percent <= threshold) {
      otherTotal += r.total;
    } else {
      major.push(r);
    }
  }

  if (otherTotal > 0) {
    major.push({ key: "Прочее", total: otherTotal, count: 0 });
  }

  return {
    labels: major.map(r => r.key),
    datasets: [
      {
        label: `Сумма`,
        data: major.map(r => r.total),
        backgroundColor: [
          "#3b82f6", "#10b981", "#f59e0b",
          "#ef4444", "#8b5cf6", "#06b6d4", "#9ca3af",
        ],
        borderWidth: 1,
      },
    ],
  };
}
