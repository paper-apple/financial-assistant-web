// SortForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SortForm } from "../../../components/modules/SortForm";
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

  it("рендер всех опций сортировки", () => {
    setup();

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("category")).toBeInTheDocument();
    expect(screen.getByText("cost")).toBeInTheDocument();
    expect(screen.getByText("place")).toBeInTheDocument();
    expect(screen.getByText("date")).toBeInTheDocument();

    expect(screen.getByText("ascending_order")).toBeInTheDocument();
    expect(screen.getByText("descending_order")).toBeInTheDocument();
  });

  it("вызов setSortField при выборе поля", () => {
    const { setSortField } = setup();

    fireEvent.click(screen.getByText("category"));
    expect(setSortField).toHaveBeenCalledWith("category");
  });

  it("вызов setSortDirection при выборе направления", () => {
    const { setSortDirection } = setup();

    fireEvent.click(screen.getByText("descending_order"));
    expect(setSortDirection).toHaveBeenCalledWith("DESC");
  });

  it("кнопка Отменить вызывает onClose", () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByText("cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("кнопка Применить вызывает applySorts и onClose", () => {
    const { applySorts, onClose } = setup();

    fireEvent.click(screen.getByText("apply"));
    expect(applySorts).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("подсветка выбранного поля и направления", () => {
    setup({ sortField: "price", sortDirection: "DESC" });

    const priceBtn = screen.getByText("cost").closest("button");
    const descBtn = screen.getByText("descending_order").closest("button");

    expect(priceBtn).toHaveClass("outline-(--bg-secondary)");
    expect(descBtn).toHaveClass("outline-(--bg-secondary)");
  });
});