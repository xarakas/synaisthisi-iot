import sys
import os
import time
import argparse
import functools
import logging
import random
import string

try:
    import pika
except Exception as ex:
    logging.error('Pika library is not present')
    sys.exit('Pika library is not present')

def randomStringDigits(stringLength=10):
    """Generate a random string of letters and digits """
    lettersAndDigits = string.ascii_letters + string.digits
    return ''.join(random.choice(lettersAndDigits) for i in range(stringLength))

our_name = os.path.basename(__file__)
logger_name = our_name.split('.')[0] + '.log'
logging.basicConfig(filename=logger_name, format='[%(asctime)s:%(levelname)s] %(message)s', level=logging.INFO, filemode='w+')
logging.info('Synaisthisi Service started for service: {0}.'.format(our_name))

# Service Arguments
parser = argparse.ArgumentParser(description='Collect arguments')
# System provide params
parser.add_argument("--username", metavar='username(text)', help="Please provide username")
parser.add_argument("--input_topics", nargs='*', metavar='Input_topic', help='AMQP Broker Input Topics')

# User (GUI) provided params
parser.add_argument("--p", metavar='password(text)', help="Please provide password")
parser.add_argument("--broker_ip", metavar='IP_broker', default='localhost', help='MQTT Broker IP')
parser.add_argument("--broker_port", metavar='PORT_broker', default=5672, help='MQTT Broker port')
parser.add_argument("--cid", metavar='clientID', default=randomStringDigits(10), help="The client ID")

args = parser.parse_args()
username=args.username
in_topics = args.input_topics
broker=args.broker_ip
port=args.broker_port
user_password=args.p
cid=args.cid

# Developer should take care to parse as many input/output topics as created in web app
# out_topic = out_topics[0]
in_topic = in_topics[0]

def on_message(channel, method_frame, header_frame, body, userdata=None):
    print("{0} : {1}".format(method_frame.delivery_tag,body))
    logging.info('Userdata: {0} Message body: {1}'.format(userdata, body))
    channel.basic_ack(delivery_tag=method_frame.delivery_tag)

# # Step #3
# def on_open(connection):
# 	logging.info("Opening connection..")
# 	print("Opening connection..")
# 	channel = connection.channel(on_channel_open)
# 	connection.setup_exchange("SYNAISTHISI_bridge")


# # Step #4
# def on_channel_open(channel):
#     # channel.basic_publish('SYNAISTHISI_bridge',
#     #                       'test',
#     #                       'Test Message',
#     #                       pika.BasicProperties(content_type='text/plain',
#     #                                            type='example'))
# 	channel.basic_consume(on_message, in_topic)
# 	logging.info("Connection Open..")
# 	print("Connection Open..")
credentials = pika.PlainCredentials(username, user_password)
parameters = pika.ConnectionParameters(host=broker, port=port, virtual_host='/', credentials=credentials)
connection = pika.BlockingConnection(parameters)

channel = connection.channel()
channel.exchange_declare(exchange='SYNAISTHISI_bridge',
                         exchange_type='topic',
                         passive=False,
                         durable=True,
                         auto_delete=False)
channel.queue_declare(queue='mqtt-subscription-123', durable=False, auto_delete=False)
channel.queue_bind(queue='mqtt-subscription-123', exchange='SYNAISTHISI_bridge', routing_key=in_topic)
channel.basic_qos(prefetch_count=1)

on_message_callback = functools.partial(on_message, userdata='on_message_userdata')
channel.basic_consume(on_message, "mqtt-subscription-123")

try:
    channel.start_consuming()
except KeyboardInterrupt:
    channel.stop_consuming()

connection.close()

# credentials = pika.PlainCredentials(username, user_password)
# param = pika.ConnectionParameters(host='localhost', port=5673, virtual_host='/', credentials=credentials)
# connection = pika.SelectConnection(param, on_open_callback=on_open)

# try:
#     # Step #2 - Block on the IOLoop
#     connection.ioloop.start()
#     #channel = connection.channel(on_channel_open)
#     #channel.start_consuming()
# # Catch a Keyboard Interrupt to make sure that the connection is closed cleanly
# except KeyboardInterrupt:

#     # Gracefully close the connection
#     connection.close()

#     # Start the IOLoop again so Pika can communicate, it will stop on its own when the connection is closed
#     connection.ioloop.start()



## channel = connection.channel()
## channel.basic_consume(on_message, 'test')
## try:
    
## except KeyboardInterrupt:
##     channel.stop_consuming()
## connection.close()