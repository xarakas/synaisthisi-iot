# encoding: utf-8
'''
S-type service for the Temperature Sensing Micro-Service
It receives a configuration command from the input topic
and it proceeds to the specific operation, such as measuring
the temperature and publishing it to an output topic.

Requires the TEMPer sensor

Created by Akis Giannoukos
'''

import time
import sys
import argparse
import threading

#imports for the TEMPer sensor
import logging
from temper import TemperHandler

try:
	import paho.mqtt.client as paho
except Exception as ex:
	sys.exit('Paho library is not present')

broker = "localhost"

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
conf_in_topic = in_topics[0]
conf_out_topic = out_topics[0]
out_topic_1 = out_topics[1]
out_topic_2 = out_topics[2]

mutex = threading.Lock()	# Lock used for mutual exclusion
exit = 0					# Flag variable to notify the threads to exit
							# in case CMD_EXIT has been called

# Variables for thread1
y_t1 = '1'
z_t1 = '*'
t1_t1 = None
t2_t1 = None
t1_status_changed = 1

# Variables for thread2
y_t2 = '1'
z_t2 = '*'
t1_t2 = None
t2_t2 = None
t2_status_changed = 1

# Developer should create a worker function for every output topic

# Worker function for the thread that operates services for the first output(Celsius)
def worker1():
	global conf_in_topic
	global out_topic_1
	global y_t1
	global z_t1
	global t1_t1
	global t2_t1
	global t1_status_changed

	sec_counter = 0		# Number of seconds elapsed during the current service

	while(True):
		mutex.acquire()
		# Check if the service needs to exit
		if(exit == 1):
			mutex.release()
			return
		# Temperature measurement
		celsius_measurement = get_readings('c')
		# If the status has changed update the variables
		if (t1_status_changed == 1):
			sec_counter = 0
			y = y_t1
			z = z_t1
			t1 = t1_t1
			t2 = t2_t1
			t1_status_changed = 0
		mutex.release()

		# If the input for z is the special character '!' ->  the temperature will not be published to the output topic
		if(z == '!'):
			time.sleep(1)
			continue

		# Publish the measurement to the selected output topic
		if(t1 == None):		# CMD_SENDF command -> always publish measurement
			client.publish(out_topic_1, "Received in topic {0}, Publishing in topic {1}, message => {2}"\
			.format(conf_in_topic, out_topic_1, "Room temperature: %0.1f°C" %  celsius_measurement))
		elif(t1[1] == '<'):	# CMD_SENDT command -> publish measurement only if threshold has been reached
			if(celsius_measurement < float(t2.split(')')[0])):
				client.publish(out_topic_1, "Received in topic {0}, Publishing in topic {1}, message => {2}"\
				.format(conf_in_topic, out_topic_1, "Room temperature: %0.1f°C" %  celsius_measurement))
		elif(t1[1] == '>'):	# CMD_SENDT command -> publish measurement only if threshold has been reached
			if(celsius_measurement > float(t2.split(')')[0])):
				client.publish(out_topic_1, "Received in topic {0}, Publishing in topic {1}, message => {2}"\
				.format(conf_in_topic, out_topic_1, "Room temperature: %0.1f°C" %  celsius_measurement))

		sec_counter += int(y); 		# Increase the elapsed second counter of the current service
		if(z == '*'):				# If the input for z is the special character '*' -> no time limit for the service
			pass
		elif(sec_counter > int(z)):	# If the time limit has been met, reset to the default configuration
			sec_counter = 0
			y = '1'
			z = '*'
			t1 = None
			t2 = None
			mutex.acquire()
			threading.currentThread().setName("Celsius Default")
			mutex.release()
		time.sleep(int(y))

# Worker function for the thread that operates services for the second output(Fahrenheit)
def worker2():
	global conf_in_topic
	global out_topic_2
	global y_t2
	global z_t2
	global t1_t2
	global t2_t2
	global t2_status_changed

	sec_counter = 0		# Number of seconds elapsed during the current service

	while(True):
		mutex.acquire()
		# Check if the service needs to exit
		if(exit == 1):
			mutex.release()
			return
		# Temperature measurement
		fahrenheit_measurement = get_readings('f')
		# If the status has changed update the variables
		if (t2_status_changed == 1):
			sec_counter = 0
			y = y_t2
			z = z_t2
			t1 = t1_t2
			t2 = t2_t2
			t2_status_changed = 0
		mutex.release()

		# If the input for z is the special character '!' ->  the temperature will not be published to the output topic
		if(z == '!'):
			time.sleep(1)
			continue

		# Publish the measurement to the selected output topic
		if(t1 == None):		# CMD_SENDF command -> always publish measurement
			client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}"\
			.format(conf_in_topic, out_topic_2, "Room temperature: %0.1f°C" %  fahrenheit_measurement))
		elif(t1[1] == '<'):	# CMD_SENDT command -> publish measurement only if threshold has been reached
			if(fahrenheit_measurement < float(t2.split(')')[0])):
				client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}"\
				.format(conf_in_topic, out_topic_2, "Room temperature: %0.1f°C" %  fahrenheit_measurement))
		elif(t1[1] == '>'):	# CMD_SENDT command -> publish measurement only if threshold has been reached
			if(fahrenheit_measurement > float(t2.split(')')[0])):
				client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}"\
				.format(conf_in_topic, out_topic_2, "Room temperature: %0.1f°C" %  fahrenheit_measurement))

		sec_counter += int(y); 		# Increase the elapsed second counter of the current service
		if(z == '*'):				# If the input for z is the special character '*' -> no time limit for the service
			pass
		elif(sec_counter > int(z)):	# If the time limit has been met, reset to the default configuration
			sec_counter = 0
			y = '1'
			z = '*'
			t1 = None
			t2 = None
			mutex.acquire()
			threading.currentThread().setName("Fahrenheit Default")
			mutex.release()
		time.sleep(int(y))

# Parses the configuration command and executes the appropriate
# operation by publishing to the correct topic
def parse_input(msg):
	global t1
	global t2
	global y_t1
	global z_t1
	global t1_t1
	global t2_t1
	global t1_status_changed
	global y_t2
	global z_t2
	global t1_t2
	global t2_t2
	global t2_status_changed
	global exit
	global mutex

	# Split the command into arguments
	args = msg.split(',')
	if(len(args) < 6):
		client.publish(conf_out_topic, "Error: Wrong command arguments")
		return
	source_srv_id = args[1]
	dest_srv_id = args[2]
	sequence_number = args[4]
	command = args[3]
	if(args[0] != "START"):
		client.publish(conf_out_topic, "Error: Missing START")
		return
	elif(args[-1] != "END"):
		client.publish(conf_out_topic, "Error: Missing END")
		return

	# Perform the operation indicated by the specific command type
	if(command == "CMD_CLEAR"):		# Stop all the running services and reset to default
		if(len(args) != 6):
			client.publish(conf_out_topic, "Error: Wrong command arguments")
			return
		# Send reply to the configuration output
		mutex.acquire()
		if(thread1.getName() == "Celsius Default" and thread2.getName() == "Fahrenheit Default"):
			# No service running
			client.publish(conf_out_topic, "No running process to stop")
			client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_CLEAR," + sequence_number + ",NULL,END")
		else:
			client.publish(conf_out_topic, "All running processes stopped")
			client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_CLEAR," + sequence_number + ",OK,END")
			# Reset the running services to the default configuration
			if(thread1.getName() != "Celsius Default"):
				y_t1 = '1'
				z_t1 = '*'
				t1_t1 = None
				t2_t1 = None
				t1_status_changed = 1
				thread1.setName("Celsius Default")
			if(thread2.getName() != "Fahrenheit Default"):
				y_t2 = '1'
				z_t2 = '*'
				t1_t2 = None
				t2_t2 = None
				t2_status_changed = 1
				thread2.setName("Fahrenheit Default")
		mutex.release()
		return
	elif(command == "CMD_SENDF"):	# Send temperature measurements to x topic, every y seconds, for z seconds
		if(len(args) != 9):
			client.publish(conf_out_topic, "Error: Wrong command arguments")
			return
		x = args[5]
		y = args[6]
		if(y == "NULL"):
			y = '5'
		z = args[7]
		if(z == "NULL"):
			z = '*'
		# Send reply to the configuration output
		if(x != out_topic_1 and x != out_topic_2):
			client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_SENDF," + sequence_number + ",NULL,?,?,END")
			return
		elif(int(y) < 1):
			client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_SENDF," + sequence_number + ",OK,NULL,?,END")
			return
		elif(z.isdigit() and int(z) < int(y)):
			client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_SENDF," + sequence_number + ",OK,OK,NULL,END")
			return
		client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_SENDF," + sequence_number + ",OK,END")
		# Notify the appropriate thread about the new operation
		if(x == out_topic_1):
			mutex.acquire()
			y_t1 = y
			z_t1 = z
			t1_t1 = None
			t2_t1 = None
			t1_status_changed = 1
			thread1.setName(msg)
			mutex.release()
		elif(x == out_topic_2):
			mutex.acquire()
			y_t2 = y
			z_t2 = z
			t1_t2 = None
			t2_t2 = None
			t2_status_changed = 1
			thread2.setName(msg)
			mutex.release()
		return
	elif(command == "CMD_SENDT"):	# Send temperature measurements to x topic, every y seconds, for z seconds, only when the threshold T has been met
		if(len(args) != 11):
			client.publish(conf_out_topic, "Error: Wrong command arguments")
			return
		x = args[5]
		y = args[6]
		if(y == "NULL"):
			y = '5'
		z = args[7]
		if(z == "NULL"):
			z = '*'
		t1 = args[8]
		t2 = args[9]
		# Send reply to the configuration output
		if(x != out_topic_1 and x != out_topic_2):
			client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_SENDT," + sequence_number + ",NULL,?,?,END")
			return
		elif(int(y) < 1):
			client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_SENDT," + sequence_number + ",OK,NULL,?,END")
			return
		elif(z.isdigit() and int(z) < int(y)):
			client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_SENDT," + sequence_number + ",OK,OK,NULL,END")
			return
		client.publish(conf_out_topic, "REPLY," + dest_srv_id + "," + source_srv_id + ",CMD_SENDT," + sequence_number + ",OK,END")
		# Notify the appropriate thread about the new operation
		if(x == out_topic_1):
			mutex.acquire()
			y_t1 = y
			z_t1 = z
			t1_t1 = t1
			t2_t1 = t2
			t1_status_changed = 1
			thread1.setName(msg)
			mutex.release()
		elif(x == out_topic_2):
			mutex.acquire()
			y_t2 = y
			z_t2 = z
			t1_t2 = t1
			t2_t2 = t2
			t2_status_changed = 1
			thread2.setName(msg)
			mutex.release()
		return
	elif(command == "CMD_STATUS"):	# Provides information about the operations that are currently running
		# Send reply to the configuration output
		if(len(args) != 6):
			client.publish(conf_out_topic, "Error: Wrong command arguments")
			return
		mutex.acquire()
		# Publish the names of the running operations to the configuration output
		client.publish(conf_out_topic, "\n---Commands being serviced currently---")
		client.publish(conf_out_topic, thread1.getName())
		client.publish(conf_out_topic, thread2.getName())
		mutex.release()
	elif(command == "CMD_EXIT"):	# Exit from the service
		if(len(args) != 6):
			client.publish(conf_out_topic, "Error: Wrong command arguments")
			return
		mutex.acquire()
		exit = 1
		mutex.release()
		client.loop_stop()
		client.disconnect()
		sys.exit(1)
	else:
		client.publish(conf_out_topic, "Error: Wrong command name")
		return

# Get the current temperature measurement using the TEMPer device API
def get_readings(parameter):
	th = TemperHandler()
	devs = th.get_devices()
	readings = []

	for dev in devs:
		sensors = [0]	#environment temperature sensor
		#sensors = [1]	#USB port temperature sensor
		temperatures = dev.get_temperatures(sensors=sensors)
		combinations = {}
		for k, v in temperatures.items():
			c = v.copy()
			combinations[k] = c
		readings.append(combinations)

	for i, reading in enumerate(readings):
		for sensor in sorted(reading):
			if(parameter == 'c' or parameter == 'C' or parameter == 'celsius' or parameter == 'Celsius'):
				return reading[sensor]['temperature_c']	#celsius measurement
			elif(parameter == 'f' or parameter == 'F' or parameter == 'fahrenheit' or parameter == 'Fahrenheit'):
				return reading[sensor]['temperature_f']	#fahrenheit measurement


# Callback to handle subscription topics incoming messages
def on_message(client, userdata, message):
	# Message Received
	msg = str(message.payload.decode("utf-8"))

	# Call the function that parses the configuration command and executes
	# the appropriate operation by publishing to the correct topic
	parse_input(msg)

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
		client.subscribe(conf_in_topic)

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

if(get_readings('c') == None):
	print("No TEMPer device connected!")
	sys.exit(1)


# Create client object
client = paho.Client("TEMPer-client")
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

# Create a thread for each output topic
thread1 = threading.Thread(name = "Celsius Default", target=worker1)
thread2 = threading.Thread(name = "Fahrenheit Default", target=worker2)
thread1.start()
thread2.start()

# Start the mqtt loop and iterate forever
client.loop_forever()
