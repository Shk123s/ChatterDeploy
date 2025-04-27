# Stage 1 - Build the React app
FROM node:18-alpine AS build
WORKDIR /app
COPY chatapp-frontend/ ./
RUN npm install && npm run build

# Stage 2 - Serve it with Nginx
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
