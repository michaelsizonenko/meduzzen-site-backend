# pull the base image
# создает базовый родительский образ
FROM node:14.19.3

# set the working direction
# создает папку для след инструкции
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
# устаналвивает постоянные переменные среды
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
# копирует в контейнер файлы и папки
COPY package.json ./

# установка необходимых пакетов
RUN npm install

# add app
COPY . .

# start app
# команда запуска контейнера
CMD ["npm", "run", "dev"]

# сообщает о необходимости открыть порт
EXPOSE 5000