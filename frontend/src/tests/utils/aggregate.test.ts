// utils/aggregate.test.ts
import { describe, it, expect } from "vitest"; // или jest
import { aggregateToMaxPoints } from "../../utils/aggregate";

type Row = { key: string; total: number; count: number };

describe("aggregateToMaxPoints", () => {
  it("возвращает исходные данные, если точек меньше maxPoints", () => {
    const rows: Row[] = [
      { key: "A", total: 10, count: 1 },
      { key: "B", total: 20, count: 2 },
    ];

    const result = aggregateToMaxPoints(rows, 5);
    expect(result).toEqual(rows);
  });

  it("агрегирует данные, если точек больше maxPoints", () => {
    const rows: Row[] = Array.from({ length: 10 }, (_, i) => ({
      key: `K${i + 1}`,
      total: i + 1,
      count: 1,
    }));

    const result = aggregateToMaxPoints(rows, 5);

    // Должно получиться 5 точек (bucketSize = ceil(10/5) = 2)
    expect(result).toHaveLength(5);

    // Проверим первую агрегированную точку
    expect(result[0]).toEqual({
      key: "K1 – K2",
      total: 1 + 2,
      count: 2,
    });

    // Проверим последнюю
    expect(result[4]).toEqual({
      key: "K9 – K10",
      total: 9 + 10,
      count: 2,
    });
  });

  it("корректно работает, если количество не делится нацело", () => {
    const rows: Row[] = Array.from({ length: 7 }, (_, i) => ({
      key: `K${i + 1}`,
      total: 1,
      count: 1,
    }));

    const result = aggregateToMaxPoints(rows, 3);

    // bucketSize = ceil(7/3) = 3 → будет 3 группы
    expect(result).toHaveLength(3);

    // Первая группа: K1–K3
    expect(result[0].key).toBe("K1 – K3");
    expect(result[0].total).toBe(3);
    expect(result[0].count).toBe(3);

    // Вторая группа: K4–K6
    expect(result[1].key).toBe("K4 – K6");
    expect(result[1].total).toBe(3);

    // Третья группа: K7–K7
    expect(result[2].key).toBe("K7 – K7");
    expect(result[2].total).toBe(1);
  });

  it("возвращает пустой массив, если вход пустой", () => {
    expect(aggregateToMaxPoints([], 5)).toEqual([]);
  });
});
