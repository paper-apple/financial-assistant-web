// StatsModal.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatsModal } from "../../../components/StatsModal";
import type { Expense } from "../../../types";

vi.mock("../../../components/StatsTable", () => ({
  StatsTable: vi.fn(() => <div data-testid="stats-table">StatsTable</div>),
}));
vi.mock("../../../components/StatsChart", () => ({
  StatsChart: vi.fn(() => <div data-testid="stats-chart">StatsChart</div>),
}));
vi.mock("../../../components/TimeSeriesChart", () => ({
  TimeSeriesChart: vi.fn(() => <div data-testid="time-chart">TimeSeriesChart</div>),
}));
vi.mock("../../../components/ui/RadioGroup", () => ({
  RadioGroup: vi.fn(({ selected }) => (
    <div data-testid="radio-group">RadioGroup: {selected}</div>
  )),
}));

describe("StatsModal", () => {
  const onClose = vi.fn();

  const expenses = [
    { id: 1, title: "Кофе", category: { id:1, name: "Еда"}, location: { id:1, name: "Кафе"}, price: 5, datetime: "2025-01-01T00:00:00Z" },
    { id: 2, title: "Книга", category: { id:1, name: "Образование"}, location: { id:1, name: "Магазин"}, price: 15, datetime: "2025-01-02T00:00:00Z" },
  ] as Expense[];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("по умолчанию рендерит таблицу", () => {
    render(<StatsModal onClose={onClose} expenses={expenses} />);
    expect(screen.getByTestId("stats-table")).toBeInTheDocument();
    expect(screen.getByTestId("radio-group")).toHaveTextContent("category");
  });

  it("отображает 'Нет данных', если expenses пуст", () => {
    render(<StatsModal onClose={onClose} expenses={[]} />);
    expect(screen.getByText("Нет данных")).toBeInTheDocument();
  });

  it("переключает режим на диаграмму", async () => {
    render(<StatsModal onClose={onClose} expenses={expenses} />);
    await userEvent.click(screen.getByRole("button", { name: "Диаграмма" }));
    expect(screen.getByTestId("stats-chart")).toBeInTheDocument();
  });

  it("переключает режим на график", async () => {
    render(<StatsModal onClose={onClose} expenses={expenses} />);
    await userEvent.click(screen.getByRole("button", { name: "График" }));
    expect(screen.getByTestId("time-chart")).toBeInTheDocument();
  });

  it("возвращает режим таблицы после переключения", async () => {
    render(<StatsModal onClose={onClose} expenses={expenses} />);
    await userEvent.click(screen.getByRole("button", { name: "Диаграмма" }));
    await userEvent.click(screen.getByRole("button", { name: "Таблица" }));
    expect(screen.getByTestId("stats-table")).toBeInTheDocument();
  });

  it("вызывает onClose при клике на кнопку 'Закрыть'", async () => {
    render(<StatsModal onClose={onClose} expenses={expenses} />);
    await userEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onClose).toHaveBeenCalled();
  });
});