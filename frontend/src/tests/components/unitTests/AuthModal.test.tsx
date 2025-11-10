// AuthModal.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, vi, it, expect } from "vitest";
import { AuthModal } from "../../../components/AuthModal";
import "@testing-library/jest-dom";

describe("AuthModal", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      isLoginMode: true,
      error: "",
      onAuth: vi.fn(),
      onToggleMode: vi.fn(),
    };
    return render(<AuthModal {...defaultProps} {...props} />);
  };

  it("не рендерится, если isOpen = false", () => {
    setup({ isOpen: false });
    expect(screen.queryByText("Вход")).not.toBeInTheDocument();
  });

  it("отображает заголовок 'Вход' в режиме логина", () => {
    setup({ isLoginMode: true });
    expect(screen.getByText("Вход")).toBeInTheDocument();
  });

  it("отображает заголовок 'Регистрация' в режиме регистрации", () => {
    setup({ isLoginMode: false });
    expect(screen.getByText("Регистрация")).toBeInTheDocument();
  });

  it("показывает ошибку из пропсов", () => {
    setup({ error: "Ошибка авторизации" });
    expect(screen.getByText("Ошибка авторизации")).toBeInTheDocument();
  });

  it("валидация: не вызывает onAuth при невалидных данных", () => {
    const onAuth = vi.fn();
    setup({ onAuth });

    fireEvent.change(screen.getByLabelText("Имя пользователя"), {
      target: { value: "D" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Войти" }));
    expect(onAuth).not.toHaveBeenCalled();
  });

  it("возвращает ошибку, если логин слишком короткий", () => {
    setup({});

    fireEvent.change(screen.getByLabelText("Имя пользователя"), {
      target: { value: "D" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Войти" }));
    expect(
      screen.getByText("Имя пользователя должно быть длиннее одного символа")
    ).toBeInTheDocument();
  });

  it.each([
    ["слишком короткий пароль", "Ab1", "Пароль должен содержать минимум 6 символов"],
    ["нет заглавной буквы", "abcdef1", "Пароль должен содержать хотя бы одну заглавную букву"],
    ["нет строчной буквы", "ABCDEF1", "Пароль должен содержать хотя бы одну строчную букву"],
    ["нет цифры", "Abcdef", "Пароль должен содержать хотя бы одну цифру"],
  ])("возвращает ошибку, если %s", (_, password, expectedError) => {
    setup({});
    fireEvent.change(screen.getByLabelText("Имя пользователя"), {
      target: { value: "Dima" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: password },
    });
        fireEvent.click(screen.getByRole("button", { name: "Войти" }));
    expect(
      screen.getByText(expectedError)
    ).toBeInTheDocument();
  });

  it("успешная отправка вызывает onAuth с корректными данными", () => {
    const onAuth = vi.fn();
    setup({ onAuth });

    fireEvent.change(screen.getByLabelText("Имя пользователя"), {
      target: { value: "Dima" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "Strong1" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(onAuth).toHaveBeenCalledWith("Dima", "Strong1");
  });

  it("кнопка переключения режима вызывает onToggleMode", () => {
    const onToggleMode = vi.fn();
    setup({ onToggleMode });

    fireEvent.click(screen.getByRole("button", { name: "Нет аккаунта?" }));
    expect(onToggleMode).toHaveBeenCalled();
  });
});