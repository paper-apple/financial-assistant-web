// aggregate.ts
export function aggregateToMaxPoints<T extends { key: string; total: number; count: number }>(
  rows: T[],
  maxPoints = 20
): T[] {
  if (rows.length <= maxPoints) return rows;

  const bucketSize = Math.ceil(rows.length / maxPoints);
  const result: T[] = [];

  for (let i = 0; i < rows.length; i += bucketSize) {
    const slice = rows.slice(i, i + bucketSize);

    const total = slice.reduce((s, r) => s + r.total, 0);
    const count = slice.reduce((s, r) => s + r.count, 0);

    const key = `${slice[0].key} – ${slice[slice.length - 1].key}`;
    result.push({ key, total, count } as T);
  }

  return result;
}