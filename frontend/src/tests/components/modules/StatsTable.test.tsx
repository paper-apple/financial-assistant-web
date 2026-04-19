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
    expect(screen.getByText("category")).toBeInTheDocument();
    expect(screen.getByText("quantity")).toBeInTheDocument();
    expect(screen.getByText("amount")).toBeInTheDocument();
  });

  it("рендер строк таблицы", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    expect(screen.getByText("Еда")).toBeInTheDocument();
    expect(screen.getByText("Транспорт")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("рендер итоговой строки", () => {
    render(<StatsTable field="category" rows={rows} totalCount={3} grandTotal={150} />);
    expect(screen.getByText("total")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });
});