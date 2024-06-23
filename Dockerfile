FROM node:latest

WORKDIR /home/prithvi/NAToR/Development/express-ping-pong-tournament/code

COPY package*.json ./

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]
