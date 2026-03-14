// TopActionBar.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TopActionBar } from "../../../components/modules/TopActionBar";

vi.mock("../../../utils/getSelectionText", () => ({
  getSelectionText: vi.fn((count, confirmDelete) =>
    confirmDelete ? `Подтвердите удаление ${count}` : `Выбрано ${count}`
  ),
}));

describe("TopActionBar", () => {
  const onSelectAll = vi.fn();
  const onDelete = vi.fn();
  const onCancel = vi.fn();
  const setSelectionMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображение обычного режима с кнопками", () => {
    render(
      <TopActionBar
        selectedCount={2}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );

    expect(screen.getByText("Выбрано 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Выбрать всё/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Удалить" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Отмена" })).toBeInTheDocument();
  });

  it("кнопка 'Выбрать всё' вызывает onSelectAll", async () => {
    render(
      <TopActionBar
        selectedCount={2}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /Выбрать всё/ }));
    expect(onSelectAll).toHaveBeenCalled();
  });

  it("кнопка 'Удалить' переключает в режим подтверждения", async () => {
    render(
      <TopActionBar
        selectedCount={2}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Удалить" }));
    expect(screen.getByText("Подтвердите удаление 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Да" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Нет" })).toBeInTheDocument();
  });

  it("кнопка 'Да' вызывает onDelete и возвращает обычный режим", async () => {
    render(
      <TopActionBar
        selectedCount={2}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Удалить" }));
    await userEvent.click(screen.getByRole("button", { name: "Да" }));
    expect(onDelete).toHaveBeenCalled();
  });

  it("кнопка 'Нет' возвращает обычный режим без вызова onDelete", async () => {
    render(
      <TopActionBar
        selectedCount={2}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Удалить" }));
    await userEvent.click(screen.getByRole("button", { name: "Нет" }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByText("Выбрано 2")).toBeInTheDocument();
  });

  it("кнопка 'Отмена' вызывает onCancel", async () => {
    render(
      <TopActionBar
        selectedCount={2}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("нажатие Escape вызывает onCancel", () => {
    render(
      <TopActionBar
        selectedCount={2}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );
    const escEvent = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(escEvent);
    expect(onCancel).toHaveBeenCalled();
  });

  it("при selectedCount=0 кнопка 'Удалить' отключена", () => {
    render(
      <TopActionBar
        selectedCount={0}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );
    expect(screen.getByRole("button", { name: "Удалить" })).toBeDisabled();
  });

  it("при selectedCount=totalCount кнопка меняет текст на 'Снять всё'", () => {
    render(
      <TopActionBar
        selectedCount={5}
        totalCount={5}
        selectionMode={true}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
        onCancel={onCancel}
        setSelectionMode={setSelectionMode}
      />
    );
    expect(screen.getByRole("button", { name: "Снять всё" })).toBeInTheDocument();
  });
});
