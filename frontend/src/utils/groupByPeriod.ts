// // utils/groupByPeriod.ts
// import { format } from "date-fns";
// import type { Expense } from "../types";
// // import { Expense } from "../types";

// export type Period = "day" | "week" | "month";

// export function groupByPeriod(expenses: Expense[], period: Period) {
//   const map = new Map<string, { total: number; count: number }>();

//   for (const e of expenses) {
//     const date = new Date(e.datetime);
//     const key =
//       period === "day"
//         ? format(date, "yyyy-MM-dd")
//         : period === "week"
//         ? format(date, "yyyy-'W'II") // ISO неделя
//         : format(date, "yyyy-MM");

//     const prev = map.get(key) || { total: 0, count: 0 };
//     map.set(key, { total: prev.total + e.amount, count: prev.count + 1 });
//   }

//   return Array.from(map.entries())
//     .sort(([a], [b]) => (a > b ? 1 : -1))
//     .map(([key, { total, count }]) => ({ key, total, count }));
// }



// utils/groupByPeriod.ts
// import { format } from "date-fns";
// import type { Expense } from "../types";

// export type Period = "day" | "week" | "month";

// function makeKey(d: Date, period: Period) {
//   switch (period) {
//     case "day":
//       return format(d, "yyyy-MM-dd");
//     case "week":
//       // ISO неделя: год + номер недели
//       return format(d, "yyyy-'W'II");
//     case "month":
//     default:
//       return format(d, "yyyy-MM");
//   }
// }

// export function groupByPeriod(expenses: Expense[], period: Period) {
//   const map = new Map<string, { total: number; count: number; firstDate: number }>();

//   for (const e of expenses) {
//     const d = new Date(e.datetime);
//     const key = makeKey(d, period);

//     const prev = map.get(key) || { total: 0, count: 0, firstDate: d.getTime() };
//     map.set(key, {
//       total: prev.total + (Number(e.price) || 0),
//       count: prev.count + 1,
//       // для стабильной сортировки по времени
//       firstDate: Math.min(prev.firstDate, d.getTime()),
//     });
//   }

//   return Array.from(map.entries())
//     .sort(([, a], [, b]) => a.firstDate - b.firstDate)
//     .map(([key, { total, count }]) => ({ key, total, count }));
// }



// utils/groupByPeriod.ts
// import { format, subMonths } from "date-fns";
// import type { Expense } from "../types";

// export type Period = "day" | "week" | "month";

// function makeKey(d: Date, period: Period) {
//   switch (period) {
//     case "day":
//       return format(d, "yyyy-MM-dd");
//     case "week":
//       return format(d, "yyyy-'W'II");
//     case "month":
//     default:
//       return format(d, "yyyy-MM");
//   }
// }

// export function groupByPeriod(expenses: Expense[], period: Period) {
//   const cutoff = subMonths(new Date(), 12).getTime(); // 12 месяцев назад
//   const map = new Map<string, { total: number; count: number; firstDate: number }>();

//   for (const e of expenses) {
//     const d = new Date(e.datetime);
//     if (d.getTime() < cutoff) continue; // пропускаем старше 12 мес

//     const key = makeKey(d, period);
//     const prev = map.get(key) || { total: 0, count: 0, firstDate: d.getTime() };

//     map.set(key, {
//       total: prev.total + (Number(e.price) || 0),
//       count: prev.count + 1,
//       firstDate: Math.min(prev.firstDate, d.getTime()),
//     });
//   }

//   return Array.from(map.entries())
//     .sort(([, a], [, b]) => a.firstDate - b.firstDate)
//     .map(([key, { total, count }]) => ({ key, total, count }));
// }



// utils/groupByPeriod.ts
// import { format, subMonths, addDays, addWeeks, addMonths, isBefore } from "date-fns";
// import type { Expense } from "../types";

// export type Period = "day" | "week" | "month";

// function makeKey(d: Date, period: Period) {
//   switch (period) {
//     case "day":
//       return format(d, "yyyy-MM-dd");
//     case "week":
//       return format(d, "yyyy-'W'II");
//     case "month":
//     default:
//       return format(d, "yyyy-MM");
//   }
// }

// function stepDate(d: Date, period: Period): Date {
//   switch (period) {
//     case "day":
//       return addDays(d, 1);
//     case "week":
//       return addWeeks(d, 1);
//     case "month":
//     default:
//       return addMonths(d, 1);
//   }
// }

// export function groupByPeriod(expenses: Expense[], period: Period) {
//   const cutoff = subMonths(new Date(), 12).getTime(); // 12 месяцев назад
//   const map = new Map<string, { total: number; count: number; firstDate: number }>();

//   for (const e of expenses) {
//     const d = new Date(e.datetime);
//     if (d.getTime() < cutoff) continue;

//     const key = makeKey(d, period);
//     const prev = map.get(key) || { total: 0, count: 0, firstDate: d.getTime() };

//     map.set(key, {
//       total: prev.total + (Number(e.price) || 0),
//       count: prev.count + 1,
//       firstDate: Math.min(prev.firstDate, d.getTime()),
//     });
//   }

//   // если нет расходов — возвращаем пустой массив
//   if (map.size === 0) return [];

//   // определяем диапазон: от самого раннего до текущей даты
//   const minDate = new Date(Math.min(...Array.from(map.values()).map(v => v.firstDate)));
//   const maxDate = new Date();

//   const result: { key: string; total: number; count: number }[] = [];
//   let cursor = minDate;

//   while (!isBefore(maxDate, cursor)) {
//     const key = makeKey(cursor, period);
//     const entry = map.get(key);
//     result.push({
//       key,
//       total: entry?.total ?? 0,
//       count: entry?.count ?? 0,
//     });
//     cursor = stepDate(cursor, period);
//   }

//   return result;
// }



// utils/groupByPeriod.ts
// import { format, subMonths, addDays, addMonths, isBefore } from "date-fns";
// import type { Expense } from "../types";

// export type Period = "day" | "month";

// function makeKey(d: Date, period: Period) {
//   switch (period) {
//     case "day":
//       return format(d, "yyyy-MM-dd");
//     case "month":
//     default:
//       return format(d, "yyyy-MM");
//   }
// }

// function stepDate(d: Date, period: Period): Date {
//   return period === "day" ? addDays(d, 1) : addMonths(d, 1);
// }

// // Определяем период автоматически на основе полного диапазона дат в expenses
// export function detectPeriod(expenses: Expense[]): Period {
//   if (expenses.length === 0) return "month";

//   const times = expenses.map(e => new Date(e.datetime).getTime());
//   const min = Math.min(...times);
//   const max = Math.max(...times);

//   const minD = new Date(min);
//   const maxD = new Date(max);

//   const monthsDiff =
//     (maxD.getFullYear() - minD.getFullYear()) * 12 +
//     (maxD.getMonth() - minD.getMonth());

//   // Если диапазон внутри трёх месяцев — группируем по дням
//   return monthsDiff <= 3 ? "day" : "month";
// }

// // Группировка с ограничением окон по времени: максимум последние 12 месяцев
// export function groupByPeriod(expenses: Expense[], period: Period) {
//   const cutoff = subMonths(new Date(), 12).getTime(); // 12 месяцев назад
//   const map = new Map<string, { total: number; count: number; firstDate: number }>();

//   for (const e of expenses) {
//     const d = new Date(e.datetime);
//     if (d.getTime() < cutoff) continue;

//     const key = makeKey(d, period);
//     const prev = map.get(key) || { total: 0, count: 0, firstDate: d.getTime() };

//     map.set(key, {
//       total: prev.total + (Number(e.price) || 0),
//       count: prev.count + 1,
//       firstDate: Math.min(prev.firstDate, d.getTime()),
//     });
//   }

//   if (map.size === 0) return [];

//   // Диапазон от самого раннего найденного периода до текущей даты
//   const minDate = new Date(Math.min(...Array.from(map.values()).map(v => v.firstDate)));
//   const maxDate = new Date();

//   const result: { key: string; total: number; count: number }[] = [];
//   let cursor = minDate;

//   while (!isBefore(maxDate, cursor)) {
//     const key = makeKey(cursor, period);
//     const entry = map.get(key);
//     result.push({
//       key,
//       total: entry?.total ?? 0,
//       count: entry?.count ?? 0,
//     });
//     cursor = stepDate(cursor, period);
//   }

//   return result;
// }



// utils/groupByPeriod.ts
import { format, subMonths, addDays, addMonths, isBefore } from "date-fns";
import type { Expense } from "../types";

export type Period = "day" | "month";

export function detectPeriod(expenses: Expense[]): Period {
  if (expenses.length === 0) return "month";

  const times = expenses.map(e => new Date(e.datetime).getTime());
  const min = Math.min(...times);
  const max = Math.max(...times);

  const minD = new Date(min);
  const maxD = new Date(max);

  const monthsDiff =
    (maxD.getFullYear() - minD.getFullYear()) * 12 +
    (maxD.getMonth() - minD.getMonth());

  return monthsDiff <= 3 ? "day" : "month";
}

function makeKey(d: Date, period: Period) {
  return period === "day"
    ? format(d, "yyyy-MM-dd")
    : format(d, "yyyy-MM");
}

function stepDate(d: Date, period: Period): Date {
  return period === "day" ? addDays(d, 1) : addMonths(d, 1);
}

export function groupByPeriod(expenses: Expense[], period: Period) {
  if (expenses.length === 0) return [];

  // 👉 находим даты
  const times = expenses.map(e => new Date(e.datetime).getTime());
  const lastDate = new Date(Math.max(...times));
  const earliestDate = new Date(Math.min(...times));

  // 👉 отсечка = 12 месяцев до последнего расхода
  const cutoff = subMonths(lastDate, 12);

  // 👉 старт = либо earliestDate (если он >= cutoff), либо cutoff
  const startDate = earliestDate >= cutoff ? earliestDate : cutoff;

  const map = new Map<string, { total: number; count: number; firstDate: number }>();

  for (const e of expenses) {
    const d = new Date(e.datetime);
    if (d < startDate) continue; // пропускаем всё, что раньше старта

    const key = makeKey(d, period);
    const prev = map.get(key) || { total: 0, count: 0, firstDate: d.getTime() };

    map.set(key, {
      total: prev.total + (Number(e.price) || 0),
      count: prev.count + 1,
      firstDate: Math.min(prev.firstDate, d.getTime()),
    });
  }

  if (map.size === 0) return [];

  // 👉 диапазон от startDate до lastDate
  const result: { key: string; total: number; count: number }[] = [];
  let cursor = startDate;

  while (!isBefore(lastDate, cursor)) {
    const key = makeKey(cursor, period);
    const entry = map.get(key);
    result.push({
      key,
      total: entry?.total ?? 0,
      count: entry?.count ?? 0,
    });
    cursor = stepDate(cursor, period);
  }

  return result;
}

