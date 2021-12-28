FROM node:16

WORKDIR /app

COPY package.json ./
COPY yarn.lock /

RUN yarn

COPY . .

RUN TZ='America/New_York' date > /app/DEPLOY_DATE

EXPOSE 8000

CMD ["yarn", "start"]
