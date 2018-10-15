'''
P-type service for the Face Detection Micro-Service
It receives a frame from the input topic and it
detects the number of faces that are present
Then, it publishes the number of faces found
to the output topic

Created by Akis Giannoukos
'''
import sys
import argparse
import cv2
import numpy as np

try:
	import paho.mqtt.client as paho
except Exception as ex:
	sys.exit('Paho library is not present')

broker = "localhost"

# File for the Computer Vision Classifier
cascPath = "/myfolder/haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascPath)

# Variable used to keep track of the changes in the number of faces
previous_no_of_faces = 0


# Service Arguments
parser = argparse.ArgumentParser(description='Collect arguments')
# System provide params
parser.add_argument("--username", metavar='username(text)', help="Please provide username")
parser.add_argument("--input_topics", nargs='*', metavar='Input_topic', help='MQTT Broker Input Topics')
parser.add_argument("--output_topics", nargs='*', metavar='Output_topic',help='MQTT Broker Output Topics')

# User (GUI) provided params
parser.add_argument("--p", metavar='password(text)', help="Please provide password")

args = parser.parse_args()
username=args.username
in_topics = args.input_topics
out_topics = args.output_topics
user_password=args.p

# Developer should take care to parse as many input/output topics as created in web app
in_topic = in_topics[0]
out_topic = out_topics[0]

# Function that performs the face detection process
def detect_faces(msg):
	global previous_no_of_faces

	# Convert the message(byte array) back to a useable type(numpy.ndarray object)
	frame = np.frombuffer(msg, dtype="uint8").reshape(480,640,-1)

	# Convert the frame to the grayscale equivalent
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

	# Detect faces in the frame
	faces = faceCascade.detectMultiScale(
		gray,
		scaleFactor=1.1,
		minNeighbors=5,
		minSize=(30, 30)
	)

	# Draw a rectangle around the faces
	for (x, y, w, h) in faces:
		cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

	# If the number of faces is different than the one in the previous frame
	# publish the new number to the output topic
	if previous_no_of_faces != len(faces):
		previous_no_of_faces = len(faces)
		if(previous_no_of_faces == 0):
			client.publish(out_topic, "No people detected")
		elif(previous_no_of_faces == 1):
			client.publish(out_topic, str(previous_no_of_faces) + " person detected")
		else:
			client.publish(out_topic, str(previous_no_of_faces) + " people detected")

# Callback to handle subscription topics incoming messages
def on_message(client, userdata, message):
	global previous_no_of_faces

	# Message received
	msg = message.payload

	# Call the function for the face detection
	detect_faces(msg)

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
client = paho.Client("P-type")
client.username_pw_set(username, user_password)

# Callback to handle subscription topics incoming messages
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
