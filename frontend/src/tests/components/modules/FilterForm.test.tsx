// FilterForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterForm } from "../../../components/modules/FilterForm";
import type { FiltersState } from "../../../types";

describe("FilterForm", () => {
  const setup = (overrides?: Partial<FiltersState>) => {
    const setKeywordInput = vi.fn();
    const setKeywordsList = vi.fn();
    const setStartDate = vi.fn();
    const setEndDate = vi.fn();
    const setMinPrice = vi.fn();
    const setMaxPrice = vi.fn();
    const backup = vi.fn();
    const restoreInitialValues = vi.fn();
    const handleResetFilters = vi.fn();
    const handleAddKeyword = vi.fn();
    const applyFilters = vi.fn();
    const onModalOpen = vi.fn();
    const onModalClose = vi.fn();

    const filtersState: FiltersState = {
      keywordInput: "",
      setKeywordInput,
      keywordsList: [],
      setKeywordsList,
      startDate: null,
      setStartDate,
      endDate: null,
      setEndDate,
      minPrice: "",
      setMinPrice,
      maxPrice: "",
      setMaxPrice,
      dateError: false,
      priceError: false,
      backup,
      restoreInitialValues,
      handleResetFilters,
      ...overrides,
    };

    const utils = render(
      <FilterForm
        suggestions={["еда", "транспорт"]}
        filtersState={filtersState}
        handleAddKeyword={handleAddKeyword}
        applyFilters={applyFilters}
        onModalOpen={onModalOpen}
        onModalClose={onModalClose}
      />
    );

    return {
      ...utils,
      setKeywordInput,
      setKeywordsList,
      setStartDate,
      setEndDate,
      setMinPrice,
      setMaxPrice,
      backup,
      restoreInitialValues,
      handleResetFilters,
      handleAddKeyword,
      applyFilters,
      onModalOpen,
      onModalClose,
    };
  };

  it("вызывает backup при монтировании", () => {
    const { backup } = setup();
    expect(backup).toHaveBeenCalled();
  });

  it("отображение сообщения, если список ключевых слов пуст", () => {
    setup();
    expect(screen.getByText("keywords_are_not_added")).toBeInTheDocument();
  });

  it("добавление ключевого слова через кнопку", () => {
    const { handleAddKeyword } = setup({ keywordInput: "еда" });
    fireEvent.click(screen.getByText("add_word"));
    expect(handleAddKeyword).toHaveBeenCalledWith("еда");
  });

  it("очистка списка ключевых слов", () => {
    const { setKeywordsList } = setup({ keywordsList: ["еда", "такси"] });
    fireEvent.click(screen.getByText("clear_list"));
    expect(setKeywordsList).toHaveBeenCalledWith([]);
  });

  it("открытие модального окна выбора даты", () => {
    const { onModalOpen } = setup();
    fireEvent.click(screen.getByTestId('input-date-from'));

    expect(onModalOpen).toHaveBeenCalledWith("startDate");
  });

  it("очистка даты окончания", () => {
    const { setEndDate } = setup({ endDate: new Date() });
    fireEvent.click(screen.getAllByRole("button", { name: "×" })[1]);
    expect(setEndDate).toHaveBeenCalled();
  });

  it("вызов setMinPrice при изменении цены", () => {
    const { setMinPrice } = setup();
    const inputs = screen.getAllByPlaceholderText("from");
    fireEvent.change(inputs[1], { target: { value: "123" } });
    expect(setMinPrice).toHaveBeenCalled();
  });

  it("вызов handleResetFilters при клике на Сбросить", () => {
    const { handleResetFilters } = setup();
    fireEvent.click(screen.getByText("reset"));
    expect(handleResetFilters).toHaveBeenCalled();
  });

  it("вызов applyFilters и onClose при Применить", () => {
    const { applyFilters, onModalClose } = setup();
    fireEvent.click(screen.getByText("apply"));
    expect(applyFilters).toHaveBeenCalled();
    expect(onModalClose).toHaveBeenCalled();
  });

  it("разрешение применения, если даты и цены валидны", () => {
    const { applyFilters, onModalClose } = setup({
      startDate: new Date("2025-01-01T00:00:00Z"),
      endDate: new Date("2025-01-05T00:00:00Z"),
      minPrice: "50",
      maxPrice: "100",
    });

    const applyBtn = screen.getByText("apply");
    expect(applyBtn).toHaveClass("btn-confirm");

    fireEvent.click(applyBtn);
    expect(applyFilters).toHaveBeenCalled();
    expect(onModalClose).toHaveBeenCalled();
  });

  it("вызов restoreInitialValues при размонтировании, если не применено", () => {
    const { restoreInitialValues, unmount } = setup();
    unmount();
    expect(restoreInitialValues).toHaveBeenCalled();
  });
}); 