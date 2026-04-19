// Modal.test.tsx
import { describe, expect, vi, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../../../components/modules/Modal";

describe("Модальное окно", () => {
  const defaultProps = {
    onRemoveModal: vi.fn(),
    children: <div data-testid="modal-children">Modal Content</div>,
    isModalOpen: true,
    onModalClose: vi.fn(),
  };

  test("рендер", () => {
    render(
      <Modal {...defaultProps}>
        <span>Modal Content</span>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("вызов onClose при нажатии на фон", () => {
    render(
      <Modal {...defaultProps}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.click(screen.getByText("Modal Content").parentElement!.parentElement!);
    expect(defaultProps.onModalClose).toHaveBeenCalledTimes(1);
  });

  test("закрытие модального окна при нажатии Esc", () => {
    render(
      <Modal {...defaultProps}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(defaultProps.onModalClose).toHaveBeenCalled();
  });
});