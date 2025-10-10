// // lib/buildChartData.ts
// import type { ChartData } from "chart.js";

// type Row = { key: string; total: number; count: number };

// export function buildChartData(
//   rows: Row[],
//   grandTotal: number,
//   threshold = 0.02
// ): ChartData<"pie", number[], string> {
//   // if (grandTotal === 0) {
//   //   return { labels: [], datasets: [] };
//   // }

//   const major: Row[] = [];
//   let otherTotal = 0;

//   for (const r of rows) {
//     const percent = r.total / grandTotal;
//     if (percent <= threshold) {
//       otherTotal += r.total;
//     } else {
//       major.push(r);
//     }
//   }

//   if (otherTotal > 0) {
//     major.push({ key: "Прочее", total: otherTotal, count: 0 });
//   }

//   return {
//     labels: major.map(r => r.key),
//     datasets: [
//       {
//         label: `Сумма`,
//         data: major.map(r => r.total),
//         backgroundColor: [
//           "#3b82f6", "#10b981", "#f59e0b",
//           "#ef4444", "#8b5cf6", "#06b6d4", "#9ca3af",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };
// }


// lib/buildChartData.ts
// Создание данных для диаграммы
import type { ChartData, ChartDataset } from "chart.js";

type Row = { key: string; total: number; count: number };

interface ExtendedPieDataset extends ChartDataset<"pie", number[]> {
  meta: { count: number; avg: number }[];
}

type ExtendedChartData = ChartData<"pie", number[], string> & {
  labels: string[];
  datasets: ExtendedPieDataset[];
};

export function buildChartData(
  rows: Row[],
  grandTotal: number,
  threshold = 0.02,
  maxSegments = 9
): ExtendedChartData {
  if (grandTotal === 0) {
    return { labels: [], datasets: [] };
  }

  // Фильтрация по threshold
  const major: Row[] = [];
  let otherTotal = 0;
  let otherCount = 0;

  for (const r of rows) {
    const percent = r.total / grandTotal;
    if (percent <= threshold) {
      otherTotal += r.total;
      otherCount += r.count;
    } else {
      major.push(r);
    }
  }

  // Сортировка оставшихся по убыванию
  major.sort((a, b) => b.total - a.total);

  // Объединение оставшихся категорий
  if (major.length > maxSegments) {
    const top = major.slice(0, maxSegments);
    const rest = major.slice(maxSegments);

    otherTotal += rest.reduce((sum, r) => sum + r.total, 0);
    otherCount += rest.reduce((sum, r) => sum + r.count, 0);

    major.length = 0;
    major.push(...top);
  }

  // Добавление "Прочее"
  if (otherTotal > 0) {
    major.push({ key: "Прочее", total: otherTotal, count: otherCount });
  }

  const meta = major.map(r => ({
    key: r.key,
    total: r.total,
    count: r.count,
    avg: r.count > 0 ? +(r.total / r.count).toFixed(2) : 0,
  }));

  const dataset: ExtendedPieDataset = {
    label: "Сумма",
    data: major.map(r => Math.round(r.total * 100) / 100),
    meta: major.map(r => ({
      count: r.count,
      avg: r.count > 0 ? +(r.total / r.count).toFixed(2) : 0,
    })),
    backgroundColor: [
          "#3b82f6", "#10b981", "#f59e0b",
          "#ef4444", "#8b5cf6", "#06b6d4",
          "#9ca3af", "#ec4899", "#14b8a6",
          "#f97316",
    ],
  };

  return {
    labels: meta.map(r => r.key),
    datasets: [dataset],
  };
}

