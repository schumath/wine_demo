FROM node:18.16.1

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3002

#RUN npm run build
CMD ["npm", "run", "start"]