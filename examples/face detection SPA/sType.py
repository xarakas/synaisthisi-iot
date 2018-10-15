'''
S-type service for the Face Detection Micro-Service
It captures a frame from the camera and publishes it
to the output topic every 2 seconds

Created by Akis Giannoukos
'''
import cv2
import sys
import time
import argparse
import threading

try:
	import paho.mqtt.client as paho
except Exception as ex:
	sys.exit('Paho library is not present')

broker = "localhost"

# Service Arguments
parser = argparse.ArgumentParser(description='Collect arguments')
# System provide params
parser.add_argument("--username", metavar='username(text)', help="Please provide username")
parser.add_argument("--output_topics", nargs='*', metavar='Output_topic',help='MQTT Broker Output Topics')
parser.add_argument("--delay", metavar='frame_delay', default='2', help="Delay between the frames")
parser.add_argument("--camera_index", metavar='camera_device_index', default='0', help="The index for the camera device that will be used")

# User (GUI) provided params
parser.add_argument("--p", metavar='password(text)', help="Please provide password")

args = parser.parse_args()
username=args.username
out_topics = args.output_topics
user_password=args.p
delay=int(args.delay)
camera_index=int(args.camera_index)

# Developer should take care to parse as many input/output topics as created in web app
out_topic = out_topics[0]


mutex = threading.Lock()	# Lock used for mutual exclusion
exit = 0					# Flag variable to notify the threads to exit


# Create a worker function for every thread
# that needs to run a service for a topic

# Worker function for the thread that receives the camera input
# and pubishes the data to the output topic
def worker():
	global out_topic
	global mutex
	global exit
	global delay

	# Start the mqtt loop
	client.loop_start()

	while True:
		# Start capturing
		video_capture = cv2.VideoCapture(camera_index)

		# Check if user wants to exit
		mutex.acquire()
		if(exit == 1):
			mutex.release()
			break
		mutex.release()

		# Check if camera is available
		if not video_capture.isOpened():
			print('Unable to load camera.')
			time.sleep(5)
			continue

		# Capture frame-by-frame
		ret, frame = video_capture.read()

		# Convert frame (numpy.ndarray object) to byte array in order to tranfer over mqtt
		binary = frame.tobytes()

		# Publish the frame to the input topic
		client.publish(out_topic,binary,0)

		mutex.acquire()
		if(exit == 1):
			mutex.release()
			break
		mutex.release()

		video_capture.release()

		# Display the resulting frame
		cv2.imshow('Video', frame)
		if cv2.waitKey(1) & 0xFF == ord('q'):
			continue
		cv2.imshow('Video', frame)

		time.sleep(delay)

	# When everything is done, release the capture
	video_capture.release()
	cv2.destroyAllWindows()

	# Stop the mqtt loop
	client.loop_stop()
	return

# Worker function for the thread that waits for "exit" to be given as input
def exit_input():
	global mutex
	global exit

	while True:
		msg = input()
		if (msg == "EXIT" or msg == "exit"):
			mutex.acquire()
			exit = 1
			mutex.release()
			break
	return


# Create an mqtt client and connect

# Create client object
client = paho.Client("S-type")
client.username_pw_set(username, user_password)
# Try to connect to the client
try:
	client.connect(broker)
except:
	print("Error connecting")
	sys.exit(7)

# Create a thread for each output topic
thread1 = threading.Thread(target=worker)
thread1.start()

thread2 = threading.Thread(target=exit_input)
thread2.start()

# Wait for the threads to join
thread1.join()
thread2.join()

# Disconnect from the mqtt client
client.disconnect()
