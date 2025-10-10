// src/utils/groupExpenses.ts
// Формирует объект для статистики, в зависимости от выбранного поля
import { type Category, type Expense, type GroupField } from "../types"

export type StatRow = {
  key: string;     // Отображаемое значение группы
  count: number;   // Кол-во покупок
  total: number;   // Общая сумма
};

export function groupExpenses(expenses: Expense[], field: GroupField): StatRow[] {
  const map = new Map<string, { display: string; count: number; total: number }>();

  for (const exp of expenses) {
    let value = exp[field];

    // Если это объект — достаём читаемое имя
    if (value && typeof value === "object") {
      // value = (value as any).name || (value as any).title || "";
      value = (value as Category || Location).name || "";
    }

    const raw = String(value ?? "").trim();
    const display = raw.length ? raw : "—";
    const norm = display.toLowerCase();

    const amount = Number(exp.price);
    const safeAmount = Number.isFinite(amount) ? amount : 0;

    const agg = map.get(norm);
    if (agg) {
      agg.count += 1;
      agg.total += safeAmount;
    } else {
      map.set(norm, { display, count: 1, total: safeAmount });
    }
  }

  return Array.from(map.values())
    .map(r => ({ 
      key: r.display, 
      count: r.count, 
      total: Math.round(r.total * 100) / 100}))
    .sort((a, b) => (b.total - a.total) || (b.count - a.count) || a.key.localeCompare(b.key));
}

