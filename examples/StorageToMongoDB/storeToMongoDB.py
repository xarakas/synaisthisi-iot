import time
import sys
import os
import argparse
import logging
import json
import datetime
from pymongo import MongoClient

global dbHandler
global dbCollectionName

# Example usage:
# python3 storeToMongoDB.py --username test --p mytest32 --input_topics ena dyo --output_topics enaOUT --dbp kati --dbu kati --dbn neo


class ArgumentParserError(Exception): pass

class ThrowingArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        raise ArgumentParserError(message)

our_name = os.path.basename(__file__)
logger_name = our_name.split('.')[0] + '.log'
logging.basicConfig(filename=logger_name, format='[%(asctime)s:%(levelname)s] %(message)s', level=logging.DEBUG, filemode='w+')
logging.info('Synaisthisi Service started for service: {0}.'.format(our_name))

try:
    import paho.mqtt.client as paho
except Exception as ex:
    logging.error('Paho library is not present')
    sys.exit('Paho library is not present')

paho.logging

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
parser.add_argument("--dbip", metavar='DB_IP', default="localhost", help="IP of the mongoDB")
parser.add_argument("--dbport", metavar='DB_Port', default=27017, help="Port of the mongoDB")
parser.add_argument("--dbu", metavar='DB_username', default="", help="Username for the mongoDB")
parser.add_argument("--dbp", metavar='DB_password', default="", help="Password for the mongoDB")
parser.add_argument("--dbn", metavar='DB_name', help="Name of the database")
parser.add_argument("--col", metavar="Collection_Name", default="messages", help="Name of the collection to store the values")

try:
    args = parser.parse_args()
except ArgumentParserError as ex:
    logging.error('{0}. Missing required arguments'.format(ex))
    sys.exit('Error while parsing runtime arguments')

try:
    username=args.username
    in_topics = args.input_topics
    out_topics = args.output_topics
    user_password=args.p
    dbip=args.dbip
    dbport=args.dbport
    dbu=args.dbu
    dbp=args.dbp
    coll=args.col
    dbname=args.dbn

    # Developer should take care to parse as many input/output topics as created in web app
    in_topic_1 = in_topics[0]
    in_topic_2 = in_topics[1]
    
    # Used for sending "will" messages
    out_topic_1 = out_topics[0]
    
except Exception as ex:
    logging.error('{0}. Possibly the number of input/output topics in your service file are not in accordance with these created in "Services" portal section.'.format(ex))
    sys.exit(ex)


#define callback
def on_message(client, userdata, message):
    r_msg = str(message.payload.decode("utf-8"))
    logging.info("message topic: {0}".format(message.topic))
    logging.info("received message ={0}".format(r_msg))
    data = {'topic':message.topic, 'msg_payload':r_msg, 'msg_id':message.mid, 'msg_qos':message.qos, 'timestamp': datetime.datetime.utcnow()}#+datetime.timedelta(hours=2)}
    #print(msg.topic+" "+str(msg.payload))

    #Write at the cache of the database
    coll_cache = dbHandler[dbname][dbCollectionName_cache]
    coll_cache.insert_one(data)

    #Write also at the archive of messages
    coll = dbHandler[dbname][dbCollectionName]
    coll.insert_one(data)
    

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



dbCollectionName = coll
dbCollectionName_cache = 'cache_' + coll
try:

    dbHandler = MongoClient('mongodb://%s:%s@%s:%s' % (dbu, dbp, dbip, dbport))
    #dbHandler.repdb.authenticate(dbu,dbp)


except Exception as inst:
    logging.error("{0}: Could not connect to DB on IP {1}:{2}".format(inst,dbip,dbport))
    sys.exit(inst)


client= paho.Client("client-mongo") 
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
client.will_set(out_topic_1,"MongoDB logger is down")
# Callback for publish actions
# client.on_publish = on_publish

# Now we try to connect
try:
    client.connect(broker, 1889)#connect
except Exception as ex:
    logging.error('Error connecting to broker, error: {0}'.format(ex))
    sys.exit('Error connecting to broker')


#client.loop_start() #start loop to process received messages
client.loop_forever()

