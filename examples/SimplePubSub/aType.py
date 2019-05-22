'''
Sample A-type service
'''
import sys
import os
import argparse
import logging
import json
import random
import string

try:
    import paho.mqtt.client as paho
except Exception as ex:
    logging.error('Paho library is not present')
    sys.exit('Paho library is not present')

def randomStringDigits(stringLength=10):
    """Generate a random string of letters and digits """
    lettersAndDigits = string.ascii_letters + string.digits
    return ''.join(random.choice(lettersAndDigits) for i in range(stringLength))

our_name = os.path.basename(__file__)
logger_name = our_name.split('.')[0] + '.log'
logging.basicConfig(filename=logger_name, format='[%(asctime)s:%(levelname)s] %(message)s', level=logging.DEBUG, filemode='w+')
logging.info('Synaisthisi Service started for service: {0}.'.format(our_name))

class ArgumentParserError(Exception): pass

class ThrowingArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        raise ArgumentParserError(message)

# Service Arguments
parser = argparse.ArgumentParser(description='Collect arguments')
# System provide params
parser.add_argument("--username", metavar='username(text)', help="Please provide username")
parser.add_argument("--input_topics", nargs='*', metavar='Input_topic', help='MQTT Broker Input Topics')

# User (GUI) provided params
parser.add_argument("--p", metavar='password(text)', help="Please provide password")
parser.add_argument("--broker_ip", metavar='IP_broker', default='localhost', help='MQTT Broker IP')
parser.add_argument("--broker_port", metavar='PORT_broker', default=1883, help='MQTT Broker port')
parser.add_argument("--cid", metavar='clientID', default=randomStringDigits(10), help="The client ID")

args = parser.parse_args()
username=args.username
in_topics = args.input_topics
user_password=args.p
cid=args.cid
broker=args.broker_ip
broker_port=args.broker_port

# Developer should take care to parse as many input/output topics as created in web app
in_topic = in_topics[0]

def perform_actuation():
    logging.info("Actuate accordingly")

# Callback to handle subscription topics incoming messages
def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    logging.info("Got Message: {0} ".format(msg))
    perform_actuation()
    # Output the message received using the Text to Speech engine

# Callback to define what to happen when disconnecting
def on_disconnect(client, userdata, flags, rc=0):
    #print("DisConnected flags {0}, result code:{1}, client_id: {2} ".format(flags, rc, client._client_id))
    return

# Callback to define what to happen when connecting
def on_connect(client, userdata, flags, rc):
    if(rc==0):
        logging.info("Connecting to broker {0}".format(broker))
        logging.info("Subscribing to topic {0}".format(in_topic))
        # Subscribe to all the input topics that we want to use
        client.subscribe(in_topic)
    elif(rc==3):
        logging.info("Server unavailable")
        client.loop_stop()
        sys.exit("Server is unavailable, please try later")
    elif(rc==5):
        logging.info("Invalid Credentials")
        client.loop_stop()
        sys.exit(5)
    else:
        logging.info("Bad connection, returned code={0}".format(rc))
        client.loop_stop()
        sys.exit("Bad connection, returned code={0}".format(rc))

# Create client object
client = paho.Client("a-type")
client.username_pw_set(username, user_password)

# Callback to handle subscription  topics incoming messages
client.on_message=on_message
# Log callback
# Callback to define what to happen when connecting, e.g. usually subscribe to topics
client.on_connect=on_connect
# Callback to define what to happen when disconnecting,
client.on_disconnect=on_disconnect

# Try to connect to the client
try:
    client.connect(broker, int(broker_port))
except:
    logging.info("Error connecting")
    sys.exit(7)
# Start the mqtt loop and iterate forever
client.loop_forever()
