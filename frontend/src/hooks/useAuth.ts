// useAuth.ts
import { useState } from "react";
import { fetchExpenses, login, logout, register } from "../api";
import { TranslationKey, useTranslation } from "./useTranslation";

export function useAuth() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [authError, setAuthError] = useState<TranslationKey>("cancel");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { t } = useTranslation()
  
  const checkAuth = async () => {
    try {
      const response = await fetchExpenses();
      setUser({ username: response.data[0].user.username });
    } catch {
      setUser(null);
      setAuthModalOpen(true);
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      await login(username, password);
      setUser({ username });
    } catch (err: any) {
      setAuthError(err.response?.data?.message || 'error_server');
      throw err;
    }
  };

  const registerUser = async (username: string, password: string) => {
    try {
      await register(username, password);
      setUser({ username });
    } catch (err: any) {
      setAuthError(err.response?.data?.message || "Ошибка регистрации");
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Ошибка выхода", err);
      throw err;
    }
  };

  return {
    user, setUser,
    authError, setAuthError,
    authModalOpen, setAuthModalOpen,
    isLoginMode, setIsLoginMode,
    checkAuth,
    loginUser,
    registerUser,
    logoutUser,
  };
}