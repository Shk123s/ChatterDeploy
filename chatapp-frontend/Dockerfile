# # Stage 1: Build React App
# FROM node:lts
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5137
# CMD ["npm", "run", "dev"]

FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve static with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80


