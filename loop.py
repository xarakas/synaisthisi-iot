import time
import subprocess
from subprocess import call
import os
call(["ln", "-s", "/usr/bin/python3","/usr/bin/python"])
#call(["cp","/syntelesis/all_config_files/mosquitto.conf","/etc/mosquitto/"])
call(["cp","/syntelesis/all_config_files/rabbitmq.conf","/etc/rabbitmq/rabbitmq.config"])
#call(["cp","/syntelesis/all_config_files/bridge_mqtt.conf","/etc/mosquitto/conf.d/bridge_mqtt.conf"])
##call(["cp","/syntelesis/all_config_files/config.ini","/org.eclipse.om2m/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/configuration/config.ini"])
first = True
if '=1885' in open('/org.eclipse.om2m/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/configuration/config.ini').read():
    first = False
    call(["echo", "Not the first time running this container!"])


if first:
	f=open("/org.eclipse.om2m/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/configuration/config.ini", "a+")
	f.write("org.eclipse.om2m.mqtt.ip=localhost\n")
	f.write("org.eclipse.om2m.mqtt.port=1885\n")
	# f.write("org.eclipse.om2m.mqtt.username=service_manager\n")
	# f.write("org.eclipse.om2m.mqtt.password=\n")
	f.write("org.eclipse.om2m.mqtt.timeout=20\n")
	f.close()


#call(["echo","'org.eclipse.om2m.mqtt.ip=localhost'",">>","/om2m-mqtt-instance/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/configuration/config.ini"])
#call(["echo","'org.eclipse.om2m.mqtt.port=1883'",">>","/om2m-mqtt-instance/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/configuration/config.ini"])
#call(["echo","'org.eclipse.om2m.mqtt.username=test'",">>","/om2m-mqtt-instance/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/configuration/config.ini"])
#call(["echo","'org.eclipse.om2m.mqtt.password=mytest32'",">>","/om2m-mqtt-instance/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/configuration/config.ini"])
#call(["echo","'org.eclipse.om2m.mqtt.timeout=20'",">>","/om2m-mqtt-instance/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/configuration/config.ini"])

#call(["ln","-s","/usr/bin/nodejs","/usr/bin/node"])

call(["service","rabbitmq-server","start"])
call(["rabbitmq-plugins","enable","rabbitmq_management"])
if first:
	call(["rabbitmqctl","add_user","test","mytest32"])
	call(["rabbitmqctl","set_user_tags","test","administrator"])
	call(["rabbitmqctl","set_permissions","-p","/","test",".*",".*",".*"])
	call(["wget","http://localhost:15672/cli/rabbitmqadmin", "-P", "/usr/local/bin"])
	call(["chmod","+x","/usr/local/bin/rabbitmqadmin"])
	call(["chown","root:root","/usr/local/bin/rabbitmqadmin"])
	call(["rabbitmqadmin","declare", "exchange","name=SYNAISTHISI_bridge","type=topic"])
call(["rabbitmq-plugins","enable","rabbitmq_mqtt"])

if first:
	call(["npm", "install", "bunyan"])
subprocess.Popen(["ponte", "-v", "-c", "/syntelesis/all_config_files/config.js", "|", "bunyan"])
#call(["rabbitmq-plugins","enable","rabbitmq_lvc_exchange"])
call(["service", "tomcat8", "start"])
call(["service", "nginx", "reload"])
call(["service", "nginx", "restart"])
#call(["service", "mosquitto", "start"])
call(["service", "postgresql", "start"])
call(["service", "wsgi_syndelesis", "start"])

os.chdir("org.eclipse.om2m/org.eclipse.om2m.site.in-cse/target/products/in-cse/linux/gtk/x86_64/")
call(["sh", "start.sh"])
os.chdir("/")
while True:
    time.sleep(5)

