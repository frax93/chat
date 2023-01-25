# Stage 1 - the build process
FROM node:14 as build-deps
ARG BUILD_ENVIRONMENT=production
WORKDIR /usr/src/app
COPY . ./
RUN npm ci
RUN npm run build:${BUILD_ENVIRONMENT}

# Stage 2 - the web server
FROM nginx:1.19.3-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
RUN chmod -R 777 /usr/share/nginx/html
EXPOSE 3002 
CMD ["nginx", "-g", "daemon off;"]

