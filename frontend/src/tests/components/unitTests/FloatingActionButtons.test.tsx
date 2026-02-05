// FloatingActionButtons.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FloatingActionButtons } from "../../../components/FloatingActionButtons";

describe("FloatingActionButtons", () => {
  const onAdd = vi.fn();
  const onFilter = vi.fn();
  const onSort = vi.fn();
  const onStats = vi.fn();
  const onLogout = vi.fn();
  const closeSelection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит 5 кнопок", () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onLogout={onLogout}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
    buttons.forEach((btn) => {
      expect(btn).toHaveClass(
        // "bg-blue-300 hover:bg-blue-500 text-white font-bold py-3.5 px-3.5 rounded-full border-1 transition-colors"
        `
  bg-blue-300/40
  hover:bg-blue-300
  hover:opacity-100
  active:bg-blue-400
  active:opacity-100
  text-white
  font-bold
  py-3.5 
  px-3.5
  rounded-full
  border
  transition-all
  duration-500
  ease-in-out
`
      );
    });
  });

  it("клик по кнопке Add вызывает closeSelection и onAdd", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onLogout={onLogout}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[4]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onAdd).toHaveBeenCalled();
  });

  it("клик по кнопке Filter вызывает closeSelection и onFilter", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onLogout={onLogout}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[3]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onFilter).toHaveBeenCalled();
  });

  it("клик по кнопке Sort вызывает closeSelection и onSort", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onLogout={onLogout}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[2]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onSort).toHaveBeenCalled();
  });

  it("клик по кнопке Stats вызывает closeSelection и onStats", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onLogout={onLogout}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[1]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onStats).toHaveBeenCalled();
  });

  it("клик по кнопке Logout вызывает closeSelection и onLogout", async () => {
    render(
      <FloatingActionButtons
        onAdd={onAdd}
        onFilter={onFilter}
        onSort={onSort}
        onStats={onStats}
        onLogout={onLogout}
        closeSelection={closeSelection}
      />
    );

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);

    expect(closeSelection).toHaveBeenCalled();
    expect(onLogout).toHaveBeenCalled();
  });
});