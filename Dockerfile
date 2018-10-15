FROM ubuntu:16.04
MAINTAINER Charilaos Akasiadis <cakasiadis@iit.demokritos.gr>


RUN apt-get update && apt-get install -y wget apt-transport-https dpkg logrotate sudo mosquitto mosquitto-clients mosquitto-auth-plugin vim gcc nginx postgresql postgresql-contrib python3-pip python3-dev libpq-dev
RUN apt-get install -y git
RUN apt-get install -y python3-pkg-resources
ADD ./syntelesis syntelesis
RUN mkdir var/www/html/syndelesis
RUN mkdir var/www/html/syndelesis/services
RUN cp -r syntelesis/* var/www/html/syndelesis/
RUN cp /syntelesis/all_config_files/auth-plugin.conf /etc/mosquitto/conf.d/

RUN pip3 install backports.functools_lru_cache 
RUN pip3 install -r /var/www/html/syndelesis/requirments.txt

ENV DATABASE_URL=postgres://vpitsilis:qwerty@localhost:5432/syndelesis
USER postgres
RUN    /etc/init.d/postgresql start &&\
    psql --command "CREATE USER vpitsilis WITH SUPERUSER PASSWORD 'qwerty';" &&\
    createdb syndelesis

USER root

RUN cp /syntelesis/all_config_files/syndelesis.conf /etc/nginx/sites-available/syndelesis.conf
RUN ln -s /etc/nginx/sites-available/syndelesis.conf /etc/nginx/sites-enabled/syndelesis.conf


RUN cp /syntelesis/all_config_files/wsgi_syndelesis /etc/init.d/
RUN chmod a+x /etc/init.d/wsgi_syndelesis


ADD ./loop.py loop.py
WORKDIR /var/www/html/syndelesis
RUN mkdir log
RUN rm /etc/nginx/sites-enabled/default

WORKDIR /
RUN git clone https://github.com/milq/milq.git
WORKDIR milq/scripts/bash
RUN bash install-opencv.sh

WORKDIR /
CMD ["python3","loop.py"]


