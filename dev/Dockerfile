FROM node:bullseye

WORKDIR /var/www/html

EXPOSE 80

RUN npm install package.json

RUN apt-get update && apt-get install -y vim && \
    apt-get install -y nginx

RUN /usr/sbin/nginx 

ENTRYPOINT ["/bin/sh", "-c" , "nginx && bash"]
