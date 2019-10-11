import time
import sys
import os
import logging
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path


##
##  Do not change!
##  \/\/\/\/\/\/\/\/
def setup_logger(name, log_file, level=logging.INFO):
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    handler = TimedRotatingFileHandler(log_file)        
    handler.setFormatter(formatter)
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)
    return logger

BASE_NAME = Path(__file__).resolve()
DIR_NAME = BASE_NAME.parent
SERVICE_FILE_NAME = BASE_NAME.name

logger_name = SERVICE_FILE_NAME.split('.')[0] + '.log'
logger_fqn = (DIR_NAME/'log'/logger_name).absolute().as_posix()
logger = setup_logger(SERVICE_FILE_NAME, logger_fqn, logging.DEBUG)
logger.info('Synaisthisi ok Service just started for service: {0}.'.format(SERVICE_FILE_NAME))

try:
    import paho.mqtt.client as paho
except Exception as ex:
    logger.error('Paho library is not present')
    sys.exit('Paho library is not present')

paho.logging
BROKER = os.environ.get('BROKER', 'localhost')
CLIENT_NAME = os.environ.get('CLIENT_NAME', '')
username = os.environ.get('username', '')
password = os.environ.get('password', '')
## 
##  /\ /\ /\ /\ /\ /\ /\ /\
## 



##
##  Add your TOPICS here
##  \/\/\/\/\/\/\/\/
in_topic_1 = os.environ.get('in_topic_1', '')
in_topic_2 = os.environ.get('in_topic_2', '')
in_topic_3 = os.environ.get('in_topic_3', '')
out_topic_1 = os.environ.get('out_topic_1', '')
out_topic_2 = os.environ.get('out_topic_2', '')


# logger.info(f'Credentials: {username}:{password}')
# logger.info(f'in_topic_1: {in_topic_1}')
# logger.info(f'in_topic_2: {in_topic_2}')
# logger.info(f'in_topic_3: {in_topic_3}')
# logger.info(f'in_topic_1: {out_topic_1}')
# logger.info(f'in_topic_2: {out_topic_2}')


##
## Define callbacks
##
## You can describe topic-specific behaviour here:
def on_message(client, userdata, message):
    time.sleep(1)
    r_msg = str(message.payload.decode("utf-8"))
    logger.info("message topic: {0}".format(message.topic))
    logger.info("received message ={0}".format(r_msg))
    if(message.topic==in_topic_1):
        logger.info('IN RCV TOPIC 1')
        client.publish(out_topic_1, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_1, out_topic_1, r_msg))
    if(message.topic==in_topic_2):
        logger.info('IN RCV TOPIC 2')
        client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_2, out_topic_2, r_msg))
    if(message.topic==in_topic_3):
        logger.info('IN RCV TOPIC 3')
        client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_3, out_topic_2, r_msg))
    # if(message.topic=="disconnect"):
    #     client.disconnect()
    #     client.loop_stop()

##
## Write logs
##
def on_log(client, userdata, level, buf):
    logger.info('Client {0}, sending userdata: {1}, buf: {2}'.format(client._client_id.decode('ascii'), userdata, buf))

##
## What to do when the service is disconnected from the platform's broker
##
def on_disconnect(client, userdata, flags, rc=0):
    logger.info('Disconnected, client: {0}'.format(client._client_id))
    sys.exit('Disconnected, client: {0}'.format(client._client_id))

##
## What to do when the service is connected to the platform's broker
##
def on_connect(client, userdata, flags, rc):
    logger.info(f'Conencting ... with : {username}:{password}')

    if(rc==0):
        logger.info("connecting to broker {0}".format(BROKER))
        logger.info("Subscribing to (input) topics")
        ##
        ##  Add subscription to your TOPICS here
        ##  \/\/\/\/\/\/\/\/
        client.subscribe(in_topic_1)
        client.subscribe(in_topic_2)
        client.subscribe(in_topic_3)
        # client.subscribe("disconnect")
        ## 
        ##  /\ /\ /\ /\ /\ /\ /\ /\
        ## 
    elif(rc==3):
        logger.error("server unavailable")
        client.loop_stop()
        sys.exit("Server is unavailable, please try later")
    elif(rc==5):
        logger.error("Invalid Credentials")
        client.loop_stop()
        sys.exit('Invalid Credentials')
    else:
        logger.error("Bad connection, returned code={0}".format(rc))
        client.loop_stop()
        sys.exit("Bad connection, returned code={0}".format(rc))



client= paho.Client(CLIENT_NAME) 
client.username_pw_set(username, password)

###### CALLBACKS
# Callback to handle subscription  topics incoming messages
client.on_message=on_message
# Log callback
client.on_log=on_log
# Callback to define what to happen when connecting, e.g. usually subscribe to topics
client.on_connect=on_connect
# Callback to define what to happen when disconnecting,
client.on_disconnect=on_disconnect
# Callback for publish actions
# client.on_publish = on_publish

# Now we try to connect
try:
    logger.info(f'Initiating connection ....')
    client.connect(BROKER)#connect
except Exception as ex:
    logger.error('Error connecting to broker, error: {0}'.format(ex))
    sys.exit('Error connecting to broker')


#client.loop_start() #start loop to process received messages
client.loop_forever()

# client.disconnect() #disconnect
# client.loop_stop() #stop loop
