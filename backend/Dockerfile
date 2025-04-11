FROM node:23

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Создаем директорию для изображений, если ее нет
RUN mkdir -p /app/static

EXPOSE 3000

# Запускаем сервер
CMD ["npm", "start"]
