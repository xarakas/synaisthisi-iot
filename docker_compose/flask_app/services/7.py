import time
import sys
import os
import argparse
import logging


class ArgumentParserError(Exception): pass

class ThrowingArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        raise ArgumentParserError(message)

our_name = os.path.basename(__file__)
logger_name = our_name.split('.')[0] + '.log'
logging.basicConfig(filename=logger_name, format='%(asctime)s %(levelname)s:%(message)s', level=logging.DEBUG, filemode='w+')
logging.info('Synaisthisi Service started for service: {0}.'.format(our_name))

try:
    import paho.mqtt.client as paho
except Exception as ex:
    logging.error('Paho library is not present')
    sys.exit('Paho library is not present')

paho.logging

# broker="broker.hivemq.com"
# broker="iot.eclipse.org"
# broker = "192.168.10.25"
broker = "localhost"


# Service Arguments
parser = ThrowingArgumentParser(description='Collect arguments')
# System provide params
parser.add_argument("--username", metavar='username(text)', help="Please provide username")
parser.add_argument("--input_topics", nargs='*', metavar='Input_topic', help='MQTT Broker Input Topics')
parser.add_argument("--output_topics", nargs='*', metavar='Input_topic',help='MQTT Broker Output Topics')

# User (GUI) provided params 
parser.add_argument("--p", metavar='password(text)', help="Please provide password")
## Runtime params
parser.add_argument("--v1", metavar='m(kgr)', default=7, help="The mass")
parser.add_argument("--v2", metavar='V(m3)', default=2, help="The volume")

try:
    args = parser.parse_args()
except ArgumentParserError as ex:
    logging.error('{0}. Expected arguments: v1 (--v1 value) or/and v2 (--v2 value)'.format(ex))
    sys.exit('Error while parsing runtime arguments')

try:
    username=args.username
    in_topics = args.input_topics
    out_topics = args.output_topics
    user_password=args.p
    v1=args.v1
    v2=args.v2

# Developer should take care to parse as many input/output topics as created in web app
    in_topic_1 = in_topics[0]
    in_topic_2 = in_topics[1]
    in_topic_3 = in_topics[2]
    # in_topic_4 = in_topics[3]

    out_topic_1 = out_topics[0]
    out_topic_2 = out_topics[1]
except Exception as ex:
    logging.error('{0}. Possibly the number of input/output topics in your service file are not in accordance with these created in "Services" portal section.'.format(ex))
    sys.exit(ex)


#define callback
def on_message(client, userdata, message):
    time.sleep(1)
    r_msg = str(message.payload.decode("utf-8"))
    logging.info("message topic: {0}".format(message.topic))
    logging.info("received message ={0}".format(r_msg))
    if(message.topic==in_topic_1):
        logging.info('IN RCV TOPIC 1')
        client.publish(out_topic_1, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_1, out_topic_1, r_msg))
    if(message.topic==in_topic_2):
        logging.info('IN RCV TOPIC 2')
        client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_2, out_topic_2, r_msg))
    if(message.topic==in_topic_3):
        client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_3, out_topic_2, r_msg))
    if(message.topic=="disconnect"):
        client.disconnect()
        client.loop_stop()

def on_log(client, userdata, level, buf):
    logging.info('Client {0}, sending userdata: {1}, buf: {2}'.format(client._client_id.decode('ascii'), userdata, buf))

def on_disconnect(client, userdata, flags, rc=0):
    logging.info('Disconnected, client: {0}'.format(client._client_id))
    sys.exit('Disconnected, client: {0}'.format(client._client_id))

def on_connect(client, userdata, flags, rc):
    if(rc==0):
        logging.info("connecting to broker {0}".format(broker))
        logging.info("Subscribing to (input) topics")
        client.subscribe(in_topic_1)
        client.subscribe(in_topic_2)
        client.subscribe(in_topic_3)
        client.subscribe("disconnect")
    elif(rc==3):
        logging.error("server unavailable")
        client.loop_stop()
        sys.exit("Server is unavailable, please try later")
    elif(rc==5):
        logging.error("Invalid Credentials")
        #client.disconnect()
        client.loop_stop()
        sys.exit('Invalid Credentials')
    else:
        logging.error("Bad connection, returned code={0}".format(rc))
        client.loop_stop()
        sys.exit("Bad connection, returned code={0}".format(rc))



client= paho.Client("client-mass") 
client.username_pw_set(username, user_password)

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
    client.connect(broker)#connect
except Exception as ex:
    logging.error('Error connecting to broker, error: {0}'.format(ex))
    sys.exit('Error connecting to broker')


#client.loop_start() #start loop to process received messages
client.loop_forever()

# client.disconnect() #disconnect
# client.loop_stop() #stop loop
