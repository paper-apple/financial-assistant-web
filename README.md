## 🚀 Демо

**[👉 Смотреть работающее приложение](https://financial-assistant-web-livid.vercel.app)** 

*(Нажми на ссылку, чтобы попробовать!)*

![Взаимодействие с записями](assets/gif/interaction-with-records.gif) 
![Анализ записей](assets/gif/record-analysis.gif) 

# Финансовый ассистент

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

## 📋 О проекте

**BudgetFlow** — это fullstack-приложение для управления личными финансами, которое позволяет:
- 📊 **Анализировать расходы** с помощью интерактивных таблицы, диаграммы и графика
- 📱 **Синхронизироваться между устройствами** благодаря облачному бэкенду
- 🔐 **Безопасно хранить данные** с JWT-аутентификацией

Проект построен на современных технологиях (NestJS + PostgreSQL + React) и демонстрирует:
- Чистую архитектуру с разделением на модули
- REST API с валидацией и обработкой ошибок
- Адаптивный интерфейс
- Интерактивную визуализацию данных

## 🛠️ Стек технологий

**Backend:**
- NestJS + TypeScript — основной фреймворк
- PostgreSQL + TypeORM
- Node
- JWT аутентификация

**Frontend:**
- React + TypeScript
- Vite
- Axios
- Tailwind

## 🛠️ Стек технологий

**Backend:**
- [NestJS](https://nestjs.com/) — основной фреймворк
- [PostgreSQL](https://www.postgresql.org/) — база данных
- [TypeORM](https://typeorm.io/) — ORM для работы с БД
- [JWT](https://jwt.io/) — аутентификация
- [Jest](https://jestjs.io/) — тестирование

**Frontend:**
- [React](https://reactjs.org/) — UI библиотека
- [TypeScript](https://www.typescriptlang.org/) — типизация
- [Redux Toolkit](https://redux-toolkit.js.org/) — управление состоянием
- [React Router](https://reactrouter.com/) — навигация
- [Axios](https://axios-http.com/) — HTTP-клиент

## 🛠️ Стек технологий

**Backend:**
- NestJS — основной фреймворк
- PostgreSQL — база данных
- TypeORM — ORM для работы с БД
- [JWT](https://jwt.io/) — аутентификация
- [Jest](https://jestjs.io/) — тестирование

**Frontend:**
- [React](https://reactjs.org/) — UI библиотека
- [TypeScript](https://www.typescriptlang.org/) — типизация
- [Redux Toolkit](https://redux-toolkit.js.org/) — управление состоянием
- [React Router](https://reactrouter.com/) — навигация
- [Axios](https://axios-http.com/) — HTTP-клиент

## 📸 Скриншоты

<table>
  <tr>
    <th width="70%">Главное окно на ПК</th>
    <th width="30%">Главное окно на телефоне</th>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshots/main-window.png" width="400"/>
    </td>
    <td align="center">
      <img src="assets/screenshots/main-window-on-phone.png" width="400"/>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th width="50%">Добавление и редактирование</th>
    <th width="50%">Статистика</th>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshots/add-edit-window.png" width="400"/>
    </td>
    <td align="center">
      <img src="assets/screenshots/stats.png" width="400"/>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th width="50%">Фильтры</th>
    <th width="50%">Сортировка</th>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshots/filters.png" width="400"/>
    </td>
    <td align="center">
      <img src="assets/screenshots/sort.png" width="400"/>
    </td>
  </tr>
</table>

## 🏗️ Архитектура проекта
FINANCIAL-ASSISTANT/<br>
├── frontend/<br>
│    ├── src/<br>
│    │   ├── components/<br>
│    │   │    ├── modules/<br>
│    │   │    └── ui/<br>
│    │   ├── hooks/<br>
│    │   ├── tests/<br>
│    │   │    ├── components/<br>
│    │   │    │    ├── modules/<br>
│    │   │    │    └── ui/<br>
│    │   │    ├── hooks/<br>
│    │   │    └── utils/<br>
│    │   └── utils/<br>
│    ├── api.ts<br>
│    ├── App.css<br>
│    ├── App.tsx<br>
│    ├── index.css<br>
│    ├── main.tsx<br>
│    └── types.tsx<br>
├── backend/<br>
│    ├── src/<br>
│    │   ├── auth/<br>
│    │   ├── categories/<br>
│    │   │    ├── dto/<br>
│    │   │    └── entities/<br>
│    │   ├── expenses/<br>
│    │   │    ├── dto/<br>
│    │   │    └── entities/<br>
│    │   ├── locations/<br>
│    │   │    ├── dto/<br>
│    │   │    └── entities/<br>
│    │   ├── tests/<br>
│    │   │    ├── auth/<br>
│    │   │    ├── categories/<br>
│    │   │    ├── expenses/<br>
│    │   │    ├── locations/<br>
│    │   │    └── users/<br>
│    │   ├── users/<br>
│    └── main.ts<br>

## 💾 Схема базы данных

![ER-диаграмма](assets/screenshots/ER-diagramm.png)

**Основные сущности:**
- `users` — пользователи
- `expenses` — расходы
- `categories` — категории расходов
- `locations` — место совершения расхода

## 🚀 Запуск через Docker

**Требования:** [Docker](https://docker.com) и [Docker Compose](https://docs.docker.com/compose/)

#### 1. Клонирование репозитория
git clone https://github.com/Risovyj-pirog/financial-assistant-web.git

#### 2. Создай файл .env (или используй .env.example)
cp .env.example .env

#### 3. Запуск сервисов
docker-compose up -d

#### 4. Загрузка тестовой БД
npm run db:restore

#### 5. Открыть приложение
http://localhost:5173

## 🚀 Ручной запуск

git clone [https://](https://github.com/Risovyj-pirog/financial-assistant-web.git)

.\setup.ps1


.\run_all.bat