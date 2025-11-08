// StatsTable.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatsTable } from "../../../components/StatsTable";

vi.mock("../tests/utils/isSafari", () => ({
  isSafari: false,
}));

describe("StatsTable", () => {
  const rows = [
    { key: "Еда", count: 2, total: 100 },
    { key: "Транспорт", count: 1, total: 50 },
  ];

  it("рендерит заголовки для поля category", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    expect(screen.getByText("Категория")).toBeInTheDocument();
    expect(screen.getByText("Кол-во")).toBeInTheDocument();
    expect(screen.getByText("Сумма")).toBeInTheDocument();
  });

  it("рендерит строки таблицы", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    expect(screen.getByText("Еда")).toBeInTheDocument();
    expect(screen.getByText("Транспорт")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("рендерит итоговую строку", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    expect(screen.getByText("Итого")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("использует класс third-column mr-3 если не Safari", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    const sumHeader = screen.getAllByText("Сумма")[0];
    expect(sumHeader).toHaveClass("third-column mr-3");
  });
});