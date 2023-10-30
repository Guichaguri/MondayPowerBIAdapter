FROM node:18

WORKDIR /usr/src/app

COPY . .
RUN npm install && npm run build && npm ci --omit=dev

EXPOSE 3000
CMD [ "npm", "run", "start" ]
