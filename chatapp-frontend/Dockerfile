# # Stage 1: Build React App
# FROM node:lts
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5137
# CMD ["npm", "run", "dev"]

# FROM node:18-alpine AS build
# WORKDIR /app
# COPY . .
# RUN npm install && npm run build
# CMD ["npm", "run", "build"]
# # Serve static with nginx
# FROM nginx:alpine
# COPY nginx/nginx.conf /etc/nginx/nginx.conf
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80

FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve static with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# nginx/Dockerfile

# # Stage 0: Build frontend
# FROM node:18-alpine AS client-build
# WORKDIR /app
# COPY . .
# RUN cd chatapp-frontend && npm install
# WORKDIR /app/chatapp-frontend
# CMD [ "npm", "run", "build" ]
# RUN npm run build
# EXPOSE 80