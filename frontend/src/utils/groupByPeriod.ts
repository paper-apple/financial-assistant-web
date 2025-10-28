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
    ? format(d, "dd.MM.yyyy")
    : format(d, "MM.yyyy");
}

function stepDate(d: Date, period: Period): Date {
  return period === "day" ? addDays(d, 1) : addMonths(d, 1);
}

export function groupByPeriod(expenses: Expense[], period: Period) {
  if (expenses.length === 0) return [];

  const times = expenses.map(e => new Date(e.datetime).getTime());
  const lastDate = new Date(Math.max(...times));
  const earliestDate = new Date(Math.min(...times));

  // 👉 теперь старт всегда с самой ранней даты
  const startDate = earliestDate;

  const map = new Map<string, { total: number; count: number; firstDate: number }>();

  for (const e of expenses) {
    const d = new Date(e.datetime);
    const key = makeKey(d, period);
    const prev = map.get(key) || { total: 0, count: 0, firstDate: d.getTime() };

    map.set(key, {
      total: prev.total + (Number(e.price) || 0),
      count: prev.count + 1,
      firstDate: Math.min(prev.firstDate, d.getTime()),
    });
  }

  if (map.size === 0) return [];

  const result: { key: string; total: number; count: number }[] = [];
  let cursor = new Date(startDate);
  cursor.setHours(0, 0, 0, 0);

  const lastDateNormalized = new Date(lastDate);
  lastDateNormalized.setHours(0, 0, 0, 0);

  while (cursor <= lastDateNormalized) {
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


