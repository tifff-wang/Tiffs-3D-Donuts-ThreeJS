FROM node:18-alpine
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install 

COPY . .

ENV NODE_ENV=production

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
