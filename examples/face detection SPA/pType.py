'''
P-type service for the Face Detection Micro-Service
It receives a frame from the input topic and it
detects the number of faces that are present
Then, it publishes the number of faces found
to the output topic

Created by Akis Giannoukos
'''
import argparse
import cv2
import numpy as np

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


# logger = logging.getLogger(logger_name)
# file_handler = logging.FileHandler(logger_fqn)
# formatter    = logging.Formatter('%(asctime)s : %(levelname)s : %(name)s : %(message)s')
# file_handler.setFormatter(formatter)
# logger.addHandler(file_handler)

logger.info('Synaisthisi ok Service just started for service: {0}.'.format(SERVICE_FILE_NAME))

cascPath = "./haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascPath)

# Variable used to keep track of the changes in the number of faces
previous_no_of_faces = 0


try:
    import paho.mqtt.client as paho
except Exception as ex:
    logger.error('Paho library is not present')
    sys.exit('Paho library is not present')

paho.logging

BROKER = os.environ.get('BROKER', '')
CLIENT_NAME = os.environ.get('CLIENT_NAME', '')
username = os.environ.get('username', '')
user_password = os.environ.get('password', '')
## 
##  /\ /\ /\ /\ /\ /\ /\ /\
## 



##
##  Add your TOPICS here
##  \/\/\/\/\/\/\/\/
in_topic = os.environ.get('in_topic_1', '')
out_topic = os.environ.get('out_topic_1', '')



logger.info('Credentials: {0}:{1}'.format(username, user_password))
logger.info('BROKER: {0}'.format(BROKER))
logger.info('in_topic_1: {0}'.format(in_topic))
logger.info('in_topic_1: {0}'.format(out_topic))

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
	logger.info("log: {0}".format(buf))

# Callback to define what to happen when disconnecting
def on_disconnect(client, userdata, flags, rc=0):
	logger.info("DisConnected flags {0}, result code:{1}, client_id: {2} ".format(flags, rc, client._client_id))

# Callback to define what to happen when connecting
def on_connect(client, userdata, flags, rc):
	if(rc==0):
		logger.info("connecting to broker {0}".format(BROKER))
		logger.info("Subscribing to (input) topics")

		# Subscribe to all the input topics that we want to use
		client.subscribe(in_topic)

	elif(rc==3):
		logger.error("server unavailable")
		client.loop_stop()
		sys.exit("Server is unavailable, please try later")
	elif(rc==5):
		logger.error("Invalid Credentials")
		client.loop_stop()
		sys.exit(5)
	else:
		logger.error("Bad connection, returned code={0}".format(rc))
		client.loop_stop()
		sys.exit("Bad connection, returned code={0}".format(rc))


# Create client object
client = paho.Client(CLIENT_NAME)
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
	client.connect(BROKER)
except:
	logger.error("Error connecting")
	sys.exit(7)

# Start the mqtt loop and iterate forever
client.loop_forever()
