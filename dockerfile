FROM node:23.11.0
COPY . .
RUN npm install

CMD ["npm", "run", "dev"]
