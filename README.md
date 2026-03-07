## 🚀 Демо

**[👉 Смотреть работающее приложение](https://financial-assistant-web-livid.vercel.app)** 

*(Нажми на ссылку, чтобы попробовать!)*

![Взаимодействие с записями](assets/gif/Взаимодействие%20с%20записями.gif) 
![Главное окно на телефоне](assets/gif/Анализ%20записей.gif) 

# Финансовый ассистент

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

## 📋 О проекте

Приложение для ведения бюджета. Предназначено для фиксации расходов и их последующего анализа.

Проект разработан в качестве дипломной работы и демонстрирует навыки fullstack-разработки.

## 🛠️ Стек технологий

**Backend:**
- NestJS + TypeScript
- PostgreSQL + TypeORM
- Node
- JWT аутентификация
- Jest (тестирование)

**Frontend:**
- React + TypeScript
- Vite
- Axios
- Tailwind

## 📸 Скриншоты

| Главное окно на ПК | Главное окно на телефоне |
|:------------------:|:------------------------:|
| ![Главное окно на ПК](assets/screenshots/Основное%20окно.png) | ![Главное окно на телефоне](assets/screenshots/Основное%20окно%20на%20телефоне.png) |

| Добавление и редактирование | Статистика |
|:------------------:|:------------------------:|
| ![Добавление и редактирование](assets/screenshots/Окно%20добавления%20и%20редактирования%20расхода.png) | ![Статистика](assets/screenshots/Статистика.png) |

| Фильтры | Сортировка |
|:---------:|:--------:|
| ![Фильтры](assets/screenshots/Фильтры.png) | ![Сортировка](assets/screenshots/Сортировка.png) |

| Добавление и редактирование | Статистика |
|:--------------------------:|:----------:|
| <img src="assets/screenshots/add-edit-window.png" width="400"> | <img src="assets/screenshots/stats.png" width="400"> |

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

| | |
|---|---|
| <img src="assets/screenshots/add-edit-window.png" width="400"/> | <img src="stats.png" width="400"/> |
| *Окно добавления и редактирования расхода* | *Страница статистики с графиками* |

## 🏗️ Архитектура проекта
FINANCIAL-ASSISTANT/
├── frontend/
│    ├── src/
│    │   ├── components/
│    │   │    ├── modules/
│    │   │    └── ui/
│    │   ├── hooks/
│    │   ├── tests/
│    │   │    ├── components/
│    │   │    │    ├── modules/
│    │   │    │    └── ui/
│    │   │    ├── hooks/
│    │   │    └── utils/
│    │   └── utils/
│    ├── api.ts
│    ├── App.css
│    ├── App.tsx
│    ├── index.css
│    ├── main.tsx
│    └── types.tsx
├── backend/
│    ├── src/
│    │   ├── auth/
│    │   ├── categories/
│    │   │    ├── dto/
│    │   │    └── entities/
│    │   ├── expenses/
│    │   │    ├── dto/
│    │   │    └── entities/
│    │   ├── locations/
│    │   │    ├── dto/
│    │   │    └── entities/
│    │   ├── tests/
│    │   │    ├── auth/
│    │   │    ├── categories/
│    │   │    ├── expenses/
│    │   │    ├── locations/
│    │   │    └── users/
│    │   ├── users/
│    └── main.ts

## 💾 Схема базы данных

![ER-диаграмма](assets/screenshots/ER-диаграмма.png)

**Основные сущности:**
- `users` — пользователи
- `expenses` — расходы
- `categories` — категории расходов
- `locations` — место совершения расхода