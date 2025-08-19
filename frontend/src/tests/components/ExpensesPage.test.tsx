import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, test } from "vitest";
import userEvent from "@testing-library/user-event";
import { ExpensesPage } from "../../pages/ExpensesPage"; // страница с модалками

beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  
test("При нажатии Esc закрывается только верхняя модалка", async () => {
  const user = userEvent.setup();

  // Открываем основную модалку
  render(<ExpensesPage />);
  const addButton = screen.getByText("+");
  await user.click(addButton);

  // Открываем вложенную модалку
  const calendarButton = screen.getByTestId("calendar-button");
  await user.click(calendarButton);

  // Родительская модалка открыта
  expect(
    screen.getByRole("dialog", { name: /Выберите дату и время/i })
  ).toBeInTheDocument();

  // Нажимаем Escape
  await user.keyboard("{Escape}");

  // Проверяем, что вложенная модалка закрылась
  expect(screen.queryByRole("dialog", { name: /Выберите дату и время/i })).not.toBeInTheDocument();

  // Основная модалка осталась
  expect(
    screen.getByRole("dialog", { name: /Добавить расход/i })
  ).toBeInTheDocument();

  // Снова нажимаем Escape
  await user.keyboard("{Escape}");

  // Родительская модалка закрылась
  expect(
    screen.queryByRole("dialog", { name: /Добавить расход/i })
  ).not.toBeInTheDocument();
})