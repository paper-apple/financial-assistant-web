// buildChartData.test.ts
import { describe, it, expect } from "vitest";
import { useChartData } from "../../hooks/useChartData";
import { renderHook } from "@testing-library/react";

describe("buildChartData", () => {
  it("возвращает пустые данные, если grandTotal = 0", () => {
    const { result } = renderHook(
      () => useChartData([], 0, 0.02),
    );
    expect(result.current.labels).toEqual([]);
    expect(result.current.datasets).toEqual([]);
  });

  it("строит данные без 'Прочее', если все категории выше threshold", () => {
    const rows = [
      { key: "A", total: 60, count: 3 },
      { key: "B", total: 40, count: 2 },
    ];

    const { result } = renderHook(
      () => useChartData(rows, 100, 0.1),
    );
    expect(result.current.labels).toEqual(["A", "B"]);
    expect(result.current.datasets[0].data).toEqual([60, 40]);
    expect(result.current.datasets[0].meta).toEqual([
      { count: 3, proportion: 60 },
      { count: 2, proportion: 40 },
    ]);
  });

  it("объединяет мелкие категории в 'Прочее' по threshold", () => {
    const rows = [
      { key: "A", total: 95, count: 10 },
      { key: "B", total: 3, count: 1 },
      { key: "C", total: 2, count: 1 },
    ];
    
    const { result } = renderHook(
      () => useChartData(rows, 100, 0.05),
    );
    expect(result.current.labels).toEqual(["A", "other"]);
    expect(result.current.datasets[0].data).toEqual([95, 5]);
    expect(result.current.datasets[0].meta).toEqual([
      { count: 10, proportion: 95 },
      { count: 2, proportion: 5 },
    ]);
  });

  it("ограничивает количество сегментов maxSegments и добавляет 'Прочее'", () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({
      key: `K${i + 1}`,
      total: 10,
      count: 1,
    }));
    
    const { result } = renderHook(
      () => useChartData(rows, 120, 0.0, 9),
    );
    expect(result.current.labels).toContain("other");
    expect(result.current.labels.length).toBe(10);
    const otherIndex = result.current.labels.indexOf("other");
    expect(result.current.datasets[0].data[otherIndex]).toBe(30);
  });

  it("корректно считает proportion", () => {
    const rows = [
      { key: "A", total: 100, count: 4 },
      { key: "B", total: 50, count: 2 },
    ];

    const { result } = renderHook(
      () => useChartData(rows, 150, 0.02),
    );
    expect(result.current.datasets[0].meta[0].proportion).toBeCloseTo(66.67, 2);
    expect(result.current.datasets[0].meta[1].proportion).toBeCloseTo(33.33, 2);
  });

  it("proportion = 100, если одна категория и count = 0", () => {
    const rows = [{ key: "A", total: 100, count: 0 }];
    const { result } = renderHook(
      () => useChartData(rows, 100, 0.02),
    );
    expect(result.current.datasets[0].meta[0].proportion).toBe(100);
    expect(result.current.datasets[0].meta[0].count).toBe(0);
  });
});
