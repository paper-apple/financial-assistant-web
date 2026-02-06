// AuthModal.tsx
import { useState } from "react";
import { useAuthValidation } from "../hooks/useAuthValidation";
import { FormField } from "./ui/FormField";

interface AuthModalProps {
  isOpen: boolean;
  isLoginMode: boolean;
  error: string;
  onAuth: (username: string, password: string) => void;
  onToggleMode: () => void;
}

export const AuthModal = ({
  isOpen,
  isLoginMode,
  error,
  onAuth,
  onToggleMode,
}: AuthModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { validateUsername, validatePassword } = useAuthValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setLocalError(usernameError || passwordError);
      return;
    }
    
    onAuth(username, password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-xs flex items-center justify-center z-50" data-testid={"auth-modal"}>
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          {isLoginMode ? "Вход" : "Регистрация"}
        </h2>

        <div className="my-4 p-2 bg-blue-100 rounded-md">
          Введите имя пользователя "user" и пароль "1234Ab" для входа в аккаунт с готовым списоком расходов, либо же создайте свой
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            testId="username"
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormField
            testId="password"
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <div
            className={`rounded h-[64px] text-
              ${error || localError ? " text-red-600" : "bg-transparent"}`}
          >
            {error || localError}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="btn-base btn-confirm"
            >
              {isLoginMode ? "Войти" : "Зарегистрироваться"}
            </button>

            <button
              type="button"
              onClick={onToggleMode}
              className="btn-base btn-cancel"
            >
              {isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};