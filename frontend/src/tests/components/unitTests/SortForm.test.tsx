// SortForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SortForm } from "../../../components/SortForm";
import type { SortState } from "../../../types";

describe("SortForm", () => {
  const setup = (overrides?: Partial<SortState>) => {
    const setSortField = vi.fn();
    const setSortDirection = vi.fn();
    const applySorts = vi.fn();
    const onClose = vi.fn();

    const sortState: SortState = {
      sortField: "title",
      setSortField,
      sortDirection: "ASC",
      setSortDirection,
      ...overrides,
    };

    render(
      <SortForm
        sortState={sortState}
        applySorts={applySorts}
        onClose={onClose}
      />
    );

    return { setSortField, setSortDirection, applySorts, onClose };
  };

  it("рендерит все опции сортировки", () => {
    setup();

    expect(screen.getByText("Название")).toBeInTheDocument();
    expect(screen.getByText("Категория")).toBeInTheDocument();
    expect(screen.getByText("Стоимость")).toBeInTheDocument();
    expect(screen.getByText("Место")).toBeInTheDocument();
    expect(screen.getByText("Дата")).toBeInTheDocument();

    expect(screen.getByText("По возрастанию")).toBeInTheDocument();
    expect(screen.getByText("По убыванию")).toBeInTheDocument();
  });

  it("вызывает setSortField при выборе поля", () => {
    const { setSortField } = setup();

    fireEvent.click(screen.getByText("Категория"));
    expect(setSortField).toHaveBeenCalledWith("category");
  });

  it("вызывает setSortDirection при выборе направления", () => {
    const { setSortDirection } = setup();

    fireEvent.click(screen.getByText("По убыванию"));
    expect(setSortDirection).toHaveBeenCalledWith("DESC");
  });

  it("кнопка Отменить вызывает onClose", () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByText("Отменить"));
    expect(onClose).toHaveBeenCalled();
  });

  it("кнопка Применить вызывает applySorts и onClose", () => {
    const { applySorts, onClose } = setup();

    fireEvent.click(screen.getByText("Применить"));
    expect(applySorts).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("подсвечивает выбранное поле и направление", () => {
    setup({ sortField: "price", sortDirection: "DESC" });

    const priceBtn = screen.getByText("Стоимость").closest("button");
    const descBtn = screen.getByText("По убыванию").closest("button");

    expect(priceBtn).toHaveClass("bg-blue-100");
    expect(descBtn).toHaveClass("bg-blue-100");
  });
});
