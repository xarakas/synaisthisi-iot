'''
A-type service for the Face Detection Micro-Service
It receives the number of faces detected by the P-type
service from the input topic and then outputs it using
Text to Speech

Created by Akis Giannoukos
'''
import sys
import argparse
import pyttsx3

try:
	import paho.mqtt.client as paho
except Exception as ex:
	sys.exit('Paho library is not present')

broker = "localhost"

# Initialize the Text to Speech engine
engine = pyttsx3.init()

# Service Arguments
parser = argparse.ArgumentParser(description='Collect arguments')
# System provide params
parser.add_argument("--username", metavar='username(text)', help="Please provide username")
parser.add_argument("--input_topics", nargs='*', metavar='Input_topic', help='MQTT Broker Input Topics')

# User (GUI) provided params
parser.add_argument("--p", metavar='password(text)', help="Please provide password")

args = parser.parse_args()
username=args.username
in_topics = args.input_topics
user_password=args.p

# Developer should take care to parse as many input/output topics as created in web app
in_topic = in_topics[0]

# Callback to handle subscription topics incoming messages
def on_message(client, userdata, message):
	msg = str(message.payload.decode("utf-8"))

	# Output the message received using the Text to Speech engine
	engine.say(msg)
	engine.runAndWait()

# Log callback
def on_log(client, userdata, level, buf):
	print("log: ", buf)

# Callback to define what to happen when disconnecting
def on_disconnect(client, userdata, flags, rc=0):
	print("DisConnected flags {0}, result code:{1}, client_id: {2} ".format(flags, rc, client._client_id))

# Callback to define what to happen when connecting
def on_connect(client, userdata, flags, rc):
	if(rc==0):
		print("connecting to broker ", broker)
		print("subscribing to topics ")

		# Subscribe to all the input topics that we want to use
		client.subscribe(in_topic)

	elif(rc==3):
		print("server unavailable")
		client.loop_stop()
		sys.exit("Server is unavailable, please try later")
	elif(rc==5):
		print("Invalid Credentials")
		client.loop_stop()
		sys.exit(5)
	else:
		print("Bad connection, returned code=",rc)
		client.loop_stop()
		sys.exit("Bad connection, returned code={0}".format(rc))


# Create client object
client = paho.Client("a-type")
client.username_pw_set(username, user_password)

# Callback to handle subscription  topics incoming messages
client.on_message=on_message
# Log callback
client.on_log=on_log
# Callback to define what to happen when connecting, e.g. usually subscribe to topics
client.on_connect=on_connect
# Callback to define what to happen when disconnecting,
client.on_disconnect=on_disconnect

# Try to connect to the client
try:
	client.connect(broker)
except:
	print("Error connecting")
	sys.exit(7)

# Start the mqtt loop and iterate forever
client.loop_forever()
