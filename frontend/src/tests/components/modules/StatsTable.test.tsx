// StatsTable.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatsTable } from "../../../components/modules/StatsTable";

vi.mock("../tests/utils/isSafari", () => ({
  isSafari: false,
}));

describe("StatsTable", () => {
  const rows = [
    { key: "Еда", count: 2, total: 100 },
    { key: "Транспорт", count: 1, total: 50 },
  ];

  it("рендер заголовков для поля category", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    expect(screen.getByText("Категория")).toBeInTheDocument();
    expect(screen.getByText("Кол-во")).toBeInTheDocument();
    expect(screen.getByText("Сумма")).toBeInTheDocument();
  });

  it("рендер строк таблицы", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    expect(screen.getByText("Еда")).toBeInTheDocument();
    expect(screen.getByText("Транспорт")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("рендери итоговой строки", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    expect(screen.getByText("Итого")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("использование класса third-column mr-1, если не Safari", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    const sumHeader = screen.getAllByText("Сумма")[0];
    expect(sumHeader).toHaveClass("third-column mr-1");
  });
});