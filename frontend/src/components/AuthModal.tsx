// AuthModal.tsx
import { useEffect, useState } from "react";
// import { useAuthValidation } from "../hooks/useAuthValidation";
import { FormField } from "./ui/FormField";
import { ErrorBar } from "./ErrorBar";

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
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("before onAuth", error)
    // await onAuth(username, password);
    // console.log("after onAuth", error)
    // if (error) {
    //   console.log("after error == true", error)
    //   setShowErrorTooltip(true)
    // }
    try {
      await onAuth(username, password);
      // Если дошли сюда - ошибки нет
      console.log("Успешный вход");
      setUsername("")
      setPassword("")
    } catch (error) {
      // Ошибка уже поймана
      setShowErrorTooltip(true);
      console.log("error", error);
    }
  };

//   useEffect(() => {
//   if (error) {
//     setShowErrorTooltip(true);
//     console.log("error", error);
//   }
// }, [error]); // Сработает когда authError изменится

  useEffect(() => {
    if (showErrorTooltip) {
      const timer = setTimeout(() => {
        setShowErrorTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showErrorTooltip]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-xs flex items-center justify-center z-50" data-testid={"auth-modal"}>
      <div className="bg-white p-3 rounded-lg shadow-md w-96">
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
          <div className="relative">
            {showErrorTooltip && (
              <div>
              <ErrorBar errorText={error}/>
              </div>
            )}
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