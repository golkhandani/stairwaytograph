FROM node:v1

WORKDIR /var/app
COPY package*.json /var/app/

RUN npm i
COPY . /var/app/

EXPOSE 3030

CMD npm start