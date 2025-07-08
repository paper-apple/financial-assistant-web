@echo off
setlocal

REM 🚀 Запуск фронтенда свернуто
start /MIN "" cmd /K "cd /d frontend && npm run dev"

REM 🐍 Запуск бэкенда свернуто с активацией виртуального окружения
start /MIN "" cmd /K "cd /d backend && call .venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM 🌐 Открытие браузера после небольшой паузы
timeout /t 2 >nul
start http://localhost:5173

endlocal
