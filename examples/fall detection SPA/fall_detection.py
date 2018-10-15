import time
import sys
import argparse
import math
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
parser.add_argument("--output_topics", nargs='*', metavar='Input_topic',help='MQTT Broker Output Topics')

# User (GUI) provided params
parser.add_argument("--p", metavar='password(text)', help="Please provide password")

# Extra arguments can be added here like this one:
# parser.add_argument("--example", metavar='example_argument', default='2', help="An argument example with a default value of 2")

args = parser.parse_args()
username=args.username
in_topics = args.input_topics
out_topics = args.output_topics
user_password=args.p
# Extra arguments must also be set here in this way
# example = args.example


# Developer should take care to parse as many input/output topics as created in web app
in_topic_1 = in_topics[0]
#More input topics can be added here

out_topic_1 = out_topics[0]
#More output topics can be added here

# Callback to handle subscription topics incoming messages
def on_message(client, userdata, message):
    r_msg = str(message.payload.decode("utf-8"))

    # Split the input using ',' as a delimeter
    arguments = r_msg.split(',')
    for str1 in arguments:
        temp = str1.split(': ')
        if(temp[0] == "Device id"):
            device_id = temp[-1]
        elif(temp[0] == " X"):
            x_accel = temp[-1]
        elif(temp[0] == " Y"):
            y_accel = temp[-1]
        elif(temp[0] == " Z"):
            z_accel = temp[-1]
        elif(temp[0] == " Timestamp"):
            timestamp = temp[-1]
        elif(temp[0] == "\nLatitude"):
            latitude = temp[-1]
        elif(temp[0] == " Longitude"):
            longitude = temp[-1]

    rootSquare = math.sqrt(math.pow(float(x_accel),2) + math.pow(float(y_accel),2) + math.pow(float(z_accel),2));
    if(rootSquare>20.0):
        client.publish(out_topic_1, device_id + '*' + 'FALL' + '*' + latitude + ',' + longitude + '*' + timestamp)
    else:
        client.publish(out_topic_1, device_id + '*' + 'NORMAL' + '*' + latitude + ',' + longitude + '*' + timestamp)

    if(message.topic=="disconnect"):
        client.disconnect()
        client.loop_stop()

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
        client.subscribe(in_topic_1)

        client.subscribe("disconnect")
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
client = paho.Client("fall-detection")
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
    client.connect(broker)#connect
except:
    print("Error connecting")
    sys.exit(7)

# Start the mqtt loop and iterate forever
client.loop_forever()
