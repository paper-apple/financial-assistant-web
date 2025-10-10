import { useState } from "react";
import { useAuthValidation } from "../hooks/useAuthValidation";

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
  // onClose,
}: AuthModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { validateUsername, validatePassword, isValid } = useAuthValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    // if (usernameError || passwordError) {
    //   setLocalError(usernameError || passwordError);
    //   return;
    // }

    onAuth(username, password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          {isLoginMode ? "Вход" : "Регистрация"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div
            className={`p-2 rounded mb-4 min-h-[64px] max-h-[64px]
              ${error || localError ? "bg-red-100 text-red-700" : "bg-transparent"}`}
          >
            {error || localError}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="btn-base btn-confirm"
            >
              {isLoginMode ? "Войти" : "Зарегистрироваться"}
            </button>

            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-500 hover:underline"
            >
              {isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
            </button>
          </div>
        </form>

        {/* <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Закрыть
        </button> */}
      </div>
    </div>
  );
};