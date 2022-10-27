FROM node:16.13.0-alpine as builder
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci --silent
COPY . /app
EXPOSE 3033
CMD ["npm", "run", "dev"]