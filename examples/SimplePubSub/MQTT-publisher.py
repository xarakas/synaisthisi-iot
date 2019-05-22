'''
Sample Publisher
'''
import sys
import os
import time
import argparse
import logging
import random
import string

try:
    import paho.mqtt.client as paho
except Exception as ex:
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
parser.add_argument("--output_topics", nargs='*', metavar='Output_topic',help='MQTT Broker Output Topics')
parser.add_argument("--input_topics", nargs='*', metavar='Input_topic', help='MQTT Broker Input Topics') # Not used here

# User (GUI) provided params
parser.add_argument("--p", metavar='password(text)', help="Please provide password")
parser.add_argument("--broker_ip", metavar='IP_broker', default='localhost', help='MQTT Broker IP')
parser.add_argument("--broker_port", metavar='PORT_broker', default=1883, help='MQTT Broker port')
parser.add_argument("--cid", metavar='clientID', default=randomStringDigits(10), help="The client ID")
parser.add_argument("--pub_frequency", metavar='pub_frequency(double)', default=0.5, help="Please provide frequency of message publication")
parser.add_argument("--pub_limit", metavar='pub_limit(int)', default=100, help="Please provide a limit to the number of messages to be published")

args = parser.parse_args()
username=args.username
out_topics = args.output_topics
user_password=args.p
broker=args.broker_ip
br_port=args.broker_port
cid=args.cid
freq=args.pub_frequency
lim=args.pub_limit
# Developer should take care to parse as many input/output topics as created in web app
out_topic = out_topics[0]


# Create client object
client = paho.Client(cid)
client.username_pw_set(username, user_password)
# Try to connect to the client
try:
    client.connect(broker,int(br_port))
except:
    logging.info('Error connecting: {0}.'.format(our_name))
    sys.exit(7)

i=0
while i<int(lim):
    # publish
    time.sleep(float(freq))
    client.publish(out_topic,  "{0} sent {1}".format(cid, i))
    logging.info('Published {0} to topic {1}'.format(str(i),out_topic))
    i=i+1

# Disconnect from the mqtt client
client.disconnect()
