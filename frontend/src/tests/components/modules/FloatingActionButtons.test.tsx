// FloatingActionButtons.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FloatingActionButtons } from "../../../components/modules/FloatingActionButtons";

describe("FloatingActionButtons", () => {
  const onAdd = vi.fn();
  const onFilter = vi.fn();
  const onSort = vi.fn();
  const onStats = vi.fn();
  const onSettings = vi.fn();
  const closeSelection = vi.fn();

  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендер кнопок", () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onSettings={onSettings}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
    buttons.forEach((btn) => {
      expect(btn).toHaveClass(
        `
          font-bold
          py-3.5 
          px-3.5
          transition-all
          duration-500
          ease-in-out
          pointer-events-auto
        `
      );
    });
  });

  it("кнопка Add вызывает closeSelection и onAdd", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onSettings={onSettings}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[4]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onAdd).toHaveBeenCalled();
  });

  it("кнопка Filter вызывает closeSelection и onFilter", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onSettings={onSettings}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[3]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onFilter).toHaveBeenCalled();
  });

  it("кнопка Sort вызывает closeSelection и onSort", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onSettings={onSettings}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[2]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onSort).toHaveBeenCalled();
  });

  it("кнопка Stats вызывает closeSelection и onStats", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onSettings={onSettings}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[1]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onStats).toHaveBeenCalled();
  });

  it("кнопка Logout вызывает closeSelection и onLogout", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onSettings={onSettings}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onSettings).toHaveBeenCalled();
  });
});