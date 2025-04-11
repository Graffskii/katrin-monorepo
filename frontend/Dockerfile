# Этап сборки
FROM node:23 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап продакшена
FROM nginx:alpine

# Копируем результат сборки из предыдущего этапа
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомную конфигурацию nginx если нужно
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
