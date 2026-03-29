// AuthModal.tsx
import { useEffect, useState } from "react";
import { FormField } from "../ui/FormField";
import { ErrorBar } from "./ErrorBar";
import { TranslationKey, useTranslation } from "../../hooks/useTranslation";
import { useSettings } from "../../context/SettingsContext";

interface AuthModalProps {
  isOpen: boolean;
  isLoginMode: boolean;
  error: TranslationKey;
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

  const { language, setLanguage } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAuth(username, password);
      setUsername("")
      setPassword("")
    } catch (error) {
      setShowErrorTooltip(true);
    }
  };

  const logInAsDemo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (language == 'ru') {
        await onAuth("testuser", "1234Ab")
        console.log('ru')
      } else {
        console.log('en')
        await onAuth("testuser_en", "1234Ab")
      }
      setUsername("")
      setPassword("")
    } catch (error) {
      setShowErrorTooltip(true);
    }
  }

  useEffect(() => {
    if (showErrorTooltip) {
      const timer = setTimeout(() => {
        setShowErrorTooltip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorTooltip]);

  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-(--modal-bg)/30 backdrop-blur-xs flex items-center justify-center z-50" data-testid={"auth-modal"}>
      <div className="bg-(--bg-secondary) rounded-lg p-3 w-full max-w-sm mx-auto shadow-md border border-(--modal-border)">
        <div className="relative flex justify-center items-center mb-4 mt-1.5">
          <h2 className="text-xl text-center text-(--text)">
            {isLoginMode ? t('enter') : t('registration')}
          </h2>
          <button 
            className="absolute right-0 px-2 py-2 rounded-lg text-sm font-medium tracking-wide border transition-colors duration-300 truncate cursor-pointer btn-cancel"
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
          >
            {language=='ru' ? 'EN' : 'RU'}
          </button>        
        </div>
        <div className="my-2 p-2 h-28 bg-(--bg-secondary) border border-(--input-border) text-(--text) rounded-md">
          {t('hello_text')}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <FormField
            testId="username"
            label="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormField
            testId="password"
            label="password"
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
          <div className="flex gap-2 mb-2">
            <button
              type="submit"
              className="btn-base btn-confirm"
            >
              {isLoginMode ? t('enter') : t('register')}
            </button>

            <button
              type="button"
              onClick={onToggleMode}
              className="btn-base btn-cancel"
            >
              {isLoginMode ? t('no_account') : t('have_account')}
            </button>
          </div>
        </form>
        <div>
          <button
            type="button"
            onClick={logInAsDemo}
            className="btn-base btn-confirm"
          >
            {t('demo')}
          </button>
        </div>
      </div>
    </div>
  );
};