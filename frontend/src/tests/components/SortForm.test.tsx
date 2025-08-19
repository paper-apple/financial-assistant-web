// src/components/SortForm.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SortForm } from "../../components/SortForm";
import type { SortParams } from "../../types";
import { userEvent } from "@testing-library/user-event";

describe("SortForm", () => {
  const initialValues: SortParams = {
    field: "price",
    direction: "desc",
  };

  it("должен корректно отображать начальные значения", () => {
    render(
      <SortForm
        // isOpen={true}
        initialValues={initialValues}
        onApply={vi.fn()}
        onClose={vi.fn()}
      />
    );

    // select field
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("price");

    // radios
    const ascRadio = screen.getByLabelText("По возрастанию") as HTMLInputElement;
    const descRadio = screen.getByLabelText("По убыванию") as HTMLInputElement;
    expect(ascRadio.checked).toBe(false);
    expect(descRadio.checked).toBe(true);
  });

  it("вызывает onClose при клике на «Отмена»", async () => {
    const onClose = vi.fn();
    render(
      <SortForm
        initialValues={initialValues}
        onApply={vi.fn()}
        onClose={onClose}
      />
    );

    await userEvent.click(screen.getByText("Отмена"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("вызывает onApply с начальным набором, если ничего не менять", async () => {
    const onApply = vi.fn();
    render(
      <SortForm
        initialValues={initialValues}
        onApply={onApply}
        onClose={vi.fn()}
      />
    );

    await userEvent.click(screen.getByText("Применить"));
    expect(onApply).toHaveBeenCalledWith(initialValues);
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it("позволяет выбрать новое поле и направление, затем вызывает onApply", async () => {
    const onApply = vi.fn();
    render(
      <SortForm
        initialValues={initialValues}
        onApply={onApply}
        onClose={vi.fn()}
      />
    );

    // меняем поле на "title"
    await userEvent.selectOptions(screen.getByRole("combobox"), "title");

    // меняем направление на asc
    await userEvent.click(screen.getByLabelText("По возрастанию"));

    // применяем
    await userEvent.click(screen.getByText("Применить"));

    expect(onApply).toHaveBeenCalledWith({
      field: "title",
      direction: "asc",
    });
  });
});
