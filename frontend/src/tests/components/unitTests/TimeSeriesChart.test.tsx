// TimeSeriesChart.test.tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TimeSeriesChart } from "../../../components/TimeSeriesChart";
import type { Expense } from "../../../types";

vi.mock("react-chartjs-2", () => ({
  Line: vi.fn(({ data, options }) => (
    <div data-testid="line-mock" data-data={JSON.stringify(data)} data-options={JSON.stringify(options)}>
      Line chart mock
    </div>
  )),
}));

vi.mock("../../../utils/groupByPeriod", () => ({
  detectPeriod: vi.fn(() => "day"),
  groupByPeriod: vi.fn(() => [
    { key: "2023-01-01–2023-01-02", total: 100, count: 2 },
    { key: "2023-01-03–2023-01-04", total: 200, count: 3 },
  ]),
}));

vi.mock("../../../utils/aggregate", () => ({
  aggregateToMaxPoints: vi.fn(rows => rows),
}));

describe("TimeSeriesChart", () => {
  const expenses = [
    { id: 1, title: "Кофе", category: { id:1, name: "Еда"}, location: { id:1, name: "Кафе"}, price: 5, datetime: "2025-01-01T00:00:00Z" },
    { id: 2, title: "Книга", category: { id:1, name: "Образование"}, location: { id:1, name: "Магазин"}, price: 15, datetime: "2025-01-02T00:00:00Z" },
  ] as Expense[];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображает 'Нет данных' при пустом массиве", () => {
    render(<TimeSeriesChart expenses={[]} />);
    expect(screen.getByText("Нет данных")).toBeInTheDocument();
  });

  it("рендерит Line с данными и опциями", () => {
    render(<TimeSeriesChart expenses={expenses} />);
    const line = screen.getByTestId("line-mock");
    expect(line).toBeInTheDocument();

    const data = JSON.parse(line.getAttribute("data-data")!);
    expect(data.labels).toEqual(["2023-01-01–2023-01-02", "2023-01-03–2023-01-04"]);
    expect(data.datasets[0].label).toBe("Сумма расходов");
    expect(data.datasets[1].label).toBe("Количество транзакций");
  });

  it("отображает нижние подписи диапазона", () => {
    render(<TimeSeriesChart expenses={expenses} />);
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("2023-01-03")).toBeInTheDocument();
  });

  it("вызывает detectPeriod, groupByPeriod и aggregateToMaxPoints", async () => {
    render(<TimeSeriesChart expenses={expenses} />);
    const { detectPeriod } = await import("../../../utils/groupByPeriod");
    const { groupByPeriod } = await import("../../../utils/groupByPeriod");
    const { aggregateToMaxPoints } = await import("../../../utils/aggregate");

    expect(detectPeriod).toHaveBeenCalledWith(expenses);
    expect(groupByPeriod).toHaveBeenCalled();
    expect(aggregateToMaxPoints).toHaveBeenCalled();
  });
});