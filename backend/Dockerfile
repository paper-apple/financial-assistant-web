# backend/Dockerfile
FROM node:22-alpine AS development

WORKDIR /usr/src/app

# Копируем файлы зависимостей
COPY package*.json ./
COPY tsconfig*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Сборка приложения
RUN npm run build

# Этап для production
FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Копируем собранное приложение из этапа development
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Запускаем приложение
CMD ["node", "dist/main"]