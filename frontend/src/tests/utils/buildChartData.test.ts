import { describe, it, expect } from "vitest";
import { buildChartData } from "../../utils/buildChartData";

describe("buildChartData", () => {
  it("возвращает пустые данные, если grandTotal = 0", () => {
    const result = buildChartData([], 0);
    expect(result.labels).toEqual([]);
    expect(result.datasets).toEqual([]);
  });

  it("строит данные без 'Прочее', если все категории выше threshold", () => {
    const rows = [
      { key: "A", total: 60, count: 3 },
      { key: "B", total: 40, count: 2 },
    ];
    const result = buildChartData(rows, 100, 0.1); // threshold = 10%
    expect(result.labels).toEqual(["A", "B"]);
    expect(result.datasets[0].data).toEqual([60, 40]);
    expect(result.datasets[0].meta).toEqual([
      { count: 3, avg: 20 },
      { count: 2, avg: 20 },
    ]);
  });

  it("объединяет мелкие категории в 'Прочее' по threshold", () => {
    const rows = [
      { key: "A", total: 95, count: 10 },
      { key: "B", total: 3, count: 1 },
      { key: "C", total: 2, count: 1 },
    ];
    const result = buildChartData(rows, 100, 0.05); // threshold = 5%
    expect(result.labels).toEqual(["A", "Прочее"]);
    expect(result.datasets[0].data).toEqual([95, 5]);
    expect(result.datasets[0].meta).toEqual([
      { count: 10, avg: 9.5 },
      { count: 2, avg: 2.5 },
    ]);
  });

  it("ограничивает количество сегментов maxSegments и добавляет 'Прочее'", () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({
      key: `K${i + 1}`,
      total: 10,
      count: 1,
    }));
    const result = buildChartData(rows, 120, 0.0, 9);
    expect(result.labels).toContain("Прочее");
    expect(result.labels.length).toBe(10); // 9 + "Прочее"
    const otherIndex = result.labels.indexOf("Прочее");
    expect(result.datasets[0].data[otherIndex]).toBe(30); // 3 категории по 10
  });

  it("корректно считает среднее значение (avg)", () => {
    const rows = [
      { key: "A", total: 100, count: 4 }, // avg = 25
      { key: "B", total: 50, count: 2 },  // avg = 25
    ];
    const result = buildChartData(rows, 150);
    expect(result.datasets[0].meta[0].avg).toBe(25);
    expect(result.datasets[0].meta[1].avg).toBe(25);
  });

  it("avg = 0, если count = 0", () => {
    const rows = [{ key: "A", total: 100, count: 0 }];
    const result = buildChartData(rows, 100);
    expect(result.datasets[0].meta[0].avg).toBe(0);
  });
});
