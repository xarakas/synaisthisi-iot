# Dockerfile-rabbitmq

# https://hub.docker.com/_/rabbitmq/
FROM rabbitmq:3-management
  
# rabbitmq will listen on these ports
EXPOSE 15672
EXPOSE 5672
EXPOSE 1885

RUN rabbitmq-plugins enable --offline rabbitmq_mqtt

COPY rabbitmq.conf /etc/rabbitmq/rabbitmq.config

ADD rabbitmq.init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

CMD ["/usr/local/bin/init.sh"]

