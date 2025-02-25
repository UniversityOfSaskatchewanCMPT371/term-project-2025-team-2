# use docker compose file to build, allows for copying from parnet directory
# build stage
FROM node:23-alpine3.20

WORKDIR /app

COPY ../../ .

RUN npm install

RUN npm run build

# server stag
FROM nginx:1.27.4-alpine

COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
