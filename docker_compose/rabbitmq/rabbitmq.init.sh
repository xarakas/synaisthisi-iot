#!/bin/sh

# Create Rabbitmq user
# ( sleep 20 ; \
# echo "*** preparing to config RABBITMQ with '$RABBITMQ_ADMIN' '$RABBITMQ_ADMIN_PASSWORD' and '$MQTT_BRIDGE'"
# # rabbitmqctl add_user $RABBITMQ_ADMIN $RABBITMQ_ADMIN_PASSWORD 2>/dev/null ; \
# # rabbitmqctl set_user_tags $RABBITMQ_ADMIN administrator ; \
# # rabbitmqctl set_permissions -p / $RABBITMQ_ADMIN  ".*" ".*" ".*" ; \
# # rabbitmq-plugins enable rabbitmq_mqtt
# # rabbitmq-plugins enable rabbitmq_management
# curl -i -u $RABBITMQ_ADMIN:$RABBITMQ_ADMIN_PASSWORD -H "content-type:application/json" -XPUT -d'{"type":"topic","durable":true}' http://localhost:15672/api/exchanges/%2F/$MQTT_BRIDGE
# #rabbitmqadmin declare exchange name=$MQTT_BRIDGE type=topic -u $RABBITMQ_ADMIN -p $RABBITMQ_ADMIN_PASSWORD --vhost=/
# echo "*** User '$RABBITMQ_ADMIN' with password '$RABBITMQ_ADMIN_PASSWORD' completed. ***" ; \
# echo "*** Log in the WebUI at port 15672 (example: http:/localhost:15672) ***") &

# $@ is used to pass arguments to the rabbitmq-server command.
# For example if you use it like this: docker run -d rabbitmq arg1 arg2,
# it will be as you run in the container rabbitmq-server arg1 arg2
rabbitmq-server $@
