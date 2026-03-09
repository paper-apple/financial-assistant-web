# frontend/Dockerfile
FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

# Этап для production сборки
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY vite.config.ts ./
COPY index.html ./

RUN npm ci

COPY . .

RUN npm run build

# Production этап с nginx
FROM nginx:stable-alpine AS production

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]