FROM node:12.13-alpine as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm ci
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]