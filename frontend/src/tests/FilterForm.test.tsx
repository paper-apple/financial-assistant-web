import React from "react";
import { format } from 'date-fns';
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// Мокаем react-datepicker, чтобы он рендерил обычный input
vi.mock("react-datepicker", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({
      selected,
      onChange,
      onCalendarClose,
      placeholderText,
    }: any) => (
      <input
        data-testid={placeholderText}
        value={
          selected
            ? selected.toISOString().slice(0, 16).replace("T", " ")
            // ? format(new Date(selected), "yyyy-MM-dd HH:mm")
            : ""
        }
        onChange={(e) => onChange(new Date(e.target.value))}
        onBlur={() => onCalendarClose()}
        placeholder={placeholderText}
      />
    ),
  };
});

import { FilterForm } from "../components/FilterForm.tsx";
import type { FilterParams } from "../types.tsx";

describe("FilterForm", () => {
  const baseDate = new Date("2025-01-01T12:00:00Z");
  const initialValues: FilterParams = {
    startDate: baseDate,
    endDate: new Date("2025-01-03T09:00:00Z"),
    minPrice: 10,
    maxPrice: 20,
    keywords: ["foo"],
  };
  const onApply = vi.fn();

  beforeEach(() => {
    onApply.mockClear();
  });

  it("рендерит начальные значения", () => {
    render(<FilterForm initialValues={initialValues} onApply={onApply} />);

    // Проверяем поля цены
    expect(screen.getByPlaceholderText("Мин")).toHaveValue("10");
    expect(screen.getByPlaceholderText("Макс")).toHaveValue("20");

    // Проверяем ключевое слово
    expect(screen.getByText("foo")).toBeInTheDocument();

    // Проверяем даты через тестовый атрибут
    expect(screen.getByTestId("От")).toHaveValue("2025-01-01 12:00");
    expect(screen.getByTestId("До")).toHaveValue("2025-01-03 09:00");
  });

  it("добавляет и удаляет ключевое слово", async () => {
    render(<FilterForm initialValues={{ ...initialValues, keywords: [] }} onApply={onApply} />);
    const input = screen.getByPlaceholderText("Введите ключевое слово");
    const addBtn = screen.getByText("Добавить ключевое слово");

    // Добавляем слово «bar»
    await userEvent.type(input, " bar ");
    await userEvent.click(addBtn);
    expect(screen.getByText("bar")).toBeInTheDocument();
    // Инпут должен очиститься
    expect(input).toHaveValue("");

    // Удаляем «bar»
    const deleteBtn = screen.getByText("✖");
    await userEvent.click(deleteBtn);
    expect(screen.queryByText("bar")).toBeNull();
  });

  it("показывает ошибку, если minPrice > maxPrice", async () => {
    render(<FilterForm initialValues={initialValues} onApply={onApply} />);
    const minInput = screen.getByPlaceholderText("Мин");
    const maxInput = screen.getByPlaceholderText("Макс");

    // Сделаем min больше max
    await userEvent.clear(minInput);
    await userEvent.type(minInput, "30");
    // Ошибка появляется автоматически по useEffect
    expect(await screen.findByText("Мин больше Макс")).toBeInTheDocument();
    // Поле в ошибочном состоянии должно иметь подходящий класс
    expect(minInput).toHaveClass("border-red-500");
  });

  it("показывает ошибку, если startDate > endDate", async () => {
    render(
      <FilterForm
        initialValues={{ ...initialValues, startDate: new Date("2025-02-02T12:00:00"), endDate: new Date("2025-02-01T12:00:00") }}
        onApply={onApply}
      />
    );
    // Триггерим onCalendarClose через blur
    const startInput = screen.getByTestId("От");
    await fireEvent.blur(startInput);

    expect(await screen.findByText("Начало позже конца")).toBeInTheDocument();
  });

  it("вызывает onApply с корректными фильтрами", async () => {
    render(<FilterForm initialValues={initialValues} onApply={onApply} />);

    // Меняем цены
    await userEvent.clear(screen.getByPlaceholderText("Мин"));
    await userEvent.type(screen.getByPlaceholderText("Мин"), "15");
    await userEvent.clear(screen.getByPlaceholderText("Макс"));
    await userEvent.type(screen.getByPlaceholderText("Макс"), "25");

    // Добавим новое ключевое слово
    await userEvent.type(screen.getByPlaceholderText("Введите ключевое слово"), "baz");
    await userEvent.click(screen.getByText("Добавить ключевое слово"));

    // Жмём «Применить»
    await userEvent.click(screen.getByText("Применить"));

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith({
      startDate: initialValues.startDate,
      endDate: initialValues.endDate,
      minPrice: 15,
      maxPrice: 25,
      keywords: ["foo", "baz"],
    });
  });

  it("сбрасывает все поля по нажатию Reset", async () => {
    render(<FilterForm initialValues={initialValues} onApply={onApply} />);

    // Жмём «Сбросить»
    await userEvent.click(screen.getByText("Сбросить"));

    // Все значения должны очиститься
    expect(screen.getByPlaceholderText("Мин")).toHaveValue("");
    expect(screen.getByPlaceholderText("Макс")).toHaveValue("");
    expect(screen.queryByText("foo")).toBeNull();
    expect(screen.getByTestId("От")).toHaveValue("");
    expect(screen.getByTestId("До")).toHaveValue("");
  });
});
