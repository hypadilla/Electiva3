FROM node:20

RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
