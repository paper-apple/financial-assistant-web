// src/components/__tests__/Modal.test.tsx
import { describe, it, expect, vi, beforeEach, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../components/Modal";
// import { test } from "@types/mocha"

describe("Modal component", () => {
  test("Рендер, когда isOpen=true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <span>Modal Content</span>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("Рендер, когда isOpen=false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <span>Modal Content</span>
      </Modal>
    );

    expect(screen.queryByText("Modal Content")).toBeNull();
  });

  test("Вызов onClose при нажатии на фон", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.click(screen.getByText("Modal Content").parentElement!.parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("Вызов onClose не должен происходить при нажатии на модальном окне", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.click(screen.getByText("Modal Content").parentElement!);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("Закрытие модального окна при нажатии Esc", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
