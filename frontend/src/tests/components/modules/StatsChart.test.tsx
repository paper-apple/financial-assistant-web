// StatsChart.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatsChart } from "../../../components/modules/StatsChart";

let lastOptions: any;

vi.mock("react-chartjs-2", () => ({
  Pie: vi.fn(({ options }) => {
    lastOptions = options;
    return <div data-testid="pie-mock">Pie chart mock</div>;
  }),
}));


describe("StatsChart", () => {
  const chartData = {
    labels: ["A", "B"],
    datasets: [
      {
        data: [100, 200],
        meta: [
          { count: 2, proportion: 50 },
          { count: 4, proportion: 50 },
        ],
      } as any,
    ],
  };

  it("рендер Pie с переданными данными", () => {
    render(<StatsChart chartData={chartData} />);
    expect(screen.getByTestId("pie-mock")).toBeInTheDocument();
  });

  it("передача опций с maintainAspectRatio=false и responsive=true", () => {
    render(<StatsChart chartData={chartData} />);
    expect(lastOptions.maintainAspectRatio).toBe(false);
    expect(lastOptions.responsive).toBe(true);
  });

  it("формирование правильных строк", () => {
    render(<StatsChart chartData={chartData} />);

    const labelFn = lastOptions.plugins.tooltip.callbacks.label;

    const context = {
      dataset: chartData.datasets[0],
      dataIndex: 0,
    };

    const result = labelFn(context);
    expect(result).toEqual([
      "sum: 100",
      "quantity: 2",
      "proportion: 50 %",
    ]);
  });
});