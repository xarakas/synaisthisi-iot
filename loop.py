import time
from subprocess import call

#call(["service","rabbitmq-server","start"])
#call(["rabbitmq-plugins","enable","rabbitmq_management"])
#call(["rabbitmqctl","add_user","test","test"])
#call(["rabbitmqctl","set_user_tags","test","administrator"])
#call(["rabbitmqctl","set_permissions","-p","/","test","\".*\"","\".*\"","\".*\""])
#call(["rabbitmq-plugins","enable","rabbitmq_mqtt"])
call(["service", "nginx", "reload"])
call(["service", "nginx", "restart"])
call(["service", "postgresql", "start"])
call(["service", "mosquitto", "start"])
call(["service", "wsgi_syndelesis", "start"])
#call(["service", "uwsgi_syndelesis", "enable"])
while True:
    time.sleep(5)

