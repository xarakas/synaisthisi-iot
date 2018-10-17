FROM ubuntu:16.04
LABEL maintainer="cakasiadis@iit.demokritos.gr"

RUN apt-get update && apt-get install -y wget apt-transport-https dpkg logrotate sudo software-properties-common
RUN apt-get install -y vim gcc nginx postgresql postgresql-contrib python3-pip python3-dev libpq-dev nodejs npm libzmq-dev
RUN apt-get autoclean
RUN apt-get install -y git unzip curl openjdk-8-jre openjdk-8-jdk maven
RUN apt-get install -y tomcat8
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
RUN apt-get update && apt-get install -y docker-ce

RUN apt-get install -y --no-install-recommends locales
RUN export LANG=en_US.UTF-8 \
    && echo $LANG UTF-8 > /etc/locale.gen \
    && locale-gen \
    && update-locale LANG=$LANG

RUN apt-get install -y python3-pkg-resources
ADD ./syntelesis syntelesis
RUN mkdir var/www/html/syndelesis
RUN mkdir var/www/html/syndelesis/services
RUN cp -r syntelesis/* var/www/html/syndelesis/

RUN pip3 install backports.functools_lru_cache 
RUN pip3 install -r /var/www/html/syndelesis/requirments.txt
RUN pip3 install pymongo pika

ENV DATABASE_URL=postgres://vpitsilis:qwerty@localhost:5432/syndelesis

# Change port configuration for tomcat
RUN sed -i '71s@.*@    <Connector port="8083" protocol="HTTP/1.1"@' /etc/tomcat8/server.xml 
WORKDIR /home/root/

RUN wget http://ftp.osuosl.org/pub/eclipse/rdf4j/eclipse-rdf4j-2.5.0-sdk.zip
RUN unzip eclipse-rdf4j-2.5.0-sdk.zip
RUN cp eclipse-rdf4j-2.5.0/war/* /var/lib/tomcat8/webapps/
RUN mkdir -p /usr/share/tomcat8/.RDF4J/server/logs
RUN chown -R tomcat8:tomcat8 /usr/share/tomcat8/

WORKDIR /

USER postgres

RUN    /etc/init.d/postgresql start &&\
    psql --command "CREATE USER vpitsilis WITH SUPERUSER PASSWORD 'qwerty';" &&\
    createdb syndelesis

USER root

RUN cp /syntelesis/all_config_files/syndelesis.conf /etc/nginx/sites-available/syndelesis.conf
RUN ln -s /etc/nginx/sites-available/syndelesis.conf /etc/nginx/sites-enabled/syndelesis.conf


RUN cp /syntelesis/all_config_files/wsgi_syndelesis /etc/init.d/
RUN chmod a+x /etc/init.d/wsgi_syndelesis


# EDW RABBIT -->>>>
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8     

RUN wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb
RUN dpkg -i erlang-solutions_1.0_all.deb
RUN apt-get update
RUN apt-get install -y esl-erlang
RUN wget http://packages.erlang-solutions.com/site/esl/esl-erlang/FLAVOUR_1_general/esl-erlang_20.1-1~ubuntu~xenial_amd64.deb
RUN dpkg -i esl-erlang_20.1-1\~ubuntu\~xenial_amd64.deb

RUN wget https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.7.10/rabbitmq-server_3.7.10-1_all.deb
RUN apt install -y ./rabbitmq-server_3.7.10-1_all.deb


ADD ./loop.py loop.py
WORKDIR /var/www/html/syndelesis
RUN mkdir log

RUN rm /etc/nginx/sites-enabled/default



# EDW OM2M -->>>>
WORKDIR /
##RUN git clone https://git.eclipse.org/r/om2m/org.eclipse.om2m
RUN git clone http://git.eclipse.org/gitroot/om2m/org.eclipse.om2m.git
##RUN git clone https://github.com/xarakas/om2m-mqtt-instance.git
##WORKDIR om2m-mqtt-instance
WORKDIR org.eclipse.om2m
# Edw gia extra configs
ADD ./patchOM2M patch
RUN git apply patch
RUN mvn clean install -U -DskipTests=True

WORKDIR /
RUN git clone https://github.com/milq/milq.git
WORKDIR milq/scripts/bash
RUN bash install-opencv.sh

USER root

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install ponte bunyan request -g

RUN mkdir /usr/share/tomcat8/.RDF4J/server/repositories/
RUN mkdir /usr/share/tomcat8/.RDF4J/server/repositories/1/
RUN cp -r /syntelesis/all_config_files/ontology/* /usr/share/tomcat8/.RDF4J/server/repositories/1/
RUN chown -R tomcat8:tomcat8 /usr/share/tomcat8/.RDF4J/server/repositories/

WORKDIR /

CMD ["python3","loop.py"]


