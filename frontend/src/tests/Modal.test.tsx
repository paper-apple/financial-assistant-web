// src/components/__tests__/Modal.test.tsx
import { describe, it, expect, vi, beforeEach, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../components/Modal";
// import { test } from "@types/mocha"

describe("Modal component", () => {
  test("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <span>Modal Content</span>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <span>Modal Content</span>
      </Modal>
    );

    expect(screen.queryByText("Modal Content")).toBeNull();
  });

  test("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.click(screen.getByText("Modal Content").parentElement!.parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("does not call onClose when content is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <span>Modal Content</span>
      </Modal>
    );

    fireEvent.click(screen.getByText("Modal Content").parentElement!);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("calls onClose when Escape is pressed and modal is topmost", () => {
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
