// Modal.test.tsx
import { describe, expect, vi, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../../../components/modules/Modal";

describe("Модальное окно", () => {
  test("рендер", () => {
    render(
      <Modal onRemoveModal={() => {}}>
        <span>Modal Content</span>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("вызов onClose при нажатии на фон", () => {
    const onClose = vi.fn();
    render(
      <Modal onRemoveModal={onClose}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.click(screen.getByText("Modal Content").parentElement!.parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("вызов onClose не должен происходить при нажатии на модальном окне", () => {
    const onClose = vi.fn();
    render(
      <Modal onRemoveModal={onClose}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.click(screen.getByText("Modal Content").parentElement!);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("закрытие модального окна при нажатии Esc", () => {
    const onClose = vi.fn();
    render(
      <Modal onRemoveModal={onClose}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});