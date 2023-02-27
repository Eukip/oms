FROM node:14.16.0-alpine3.10
RUN mkdir /gui
WORKDIR /gui
COPY package.json /gui
RUN npm install
COPY . /gui
#RUN npm start
