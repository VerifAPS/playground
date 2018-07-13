FROM nginx

# RUN apk update \
#     && apk add nginx \
#     && adduser -D -g 'www' www\
#     && mkdir /www \
#     && chown -R www:www /var/lib/nginx\
#     && chown -R www:www /www
#COPY share/nginx.conf /etc/nginx/nginx.conf

ADD dist /usr/share/nginx/html
