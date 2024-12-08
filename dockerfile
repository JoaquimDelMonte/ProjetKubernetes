FROM node:latest

WORKDIR C:\Users\Joaquim\source\nodeapp_test

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 4000
CMD [ "node", "index.js" ]
