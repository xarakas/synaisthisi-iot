import time
import sys
import argparse
try:
    import paho.mqtt.client as paho
except Exception as ex:
    sys.exit('Paho library is not present')

# broker="broker.hivemq.com"
# broker="iot.eclipse.org"
# broker = "192.168.10.25"
broker = "localhost"


# Service Arguments
parser = argparse.ArgumentParser(description='Collect arguments')
# System provide params
parser.add_argument("--username", metavar='username(text)', help="Please provide username")
parser.add_argument("--input_topics", nargs='*', metavar='Input_topic', help='MQTT Broker Input Topics')
parser.add_argument("--output_topics", nargs='*', metavar='Input_topic',help='MQTT Broker Output Topics')

# User (GUI) provided params 
parser.add_argument("--p", metavar='password(text)', help="Please provide password")
## Runtime params
parser.add_argument("--v1", metavar='m(kgr)', default=7, help="The mass")
parser.add_argument("--v2", metavar='V(m3)', default=2, help="The volume")


args = parser.parse_args()
try:
    username=args.username
    in_topics = args.input_topics
    out_topics = args.output_topics
    user_password=args.p
    v1=args.v1
    v2=args.v2

# Developer should take care to parse as many input/output topics as created in web app
    in_topic_1 = in_topics[0]
    in_topic_2 = in_topics[1]
    in_topic_3 = in_topics[2]
    # in_topic_4 = in_topics[3]

    out_topic_1 = out_topics[0]
    out_topic_2 = out_topics[1]
except Exception as ex:
    sys.exit(ex)


#define callback
def on_message(client, userdata, message):
    time.sleep(1)
    r_msg = str(message.payload.decode("utf-8"))
    print("message topic:",message.topic)
    print("received message =", r_msg)
    if(message.topic==in_topic_1):
        print('IN RCV TOPIC 1')
        client.publish(out_topic_1, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_1, out_topic_1, r_msg))
    if(message.topic==in_topic_2):
        print('IN RCV TOPIC 2')
        client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_2, out_topic_2, r_msg))
    if(message.topic==in_topic_3):
        client.publish(out_topic_2, "Received in topic {0}, Publishing in topic {1}, message => {2}".format(in_topic_3, out_topic_2, r_msg))
    if(message.topic=="disconnect"):
        client.disconnect()
        client.loop_stop()

def on_log(client, userdata, level, buf):
    print("log: ", buf)

def on_disconnect(client, userdata, flags, rc=0):
    sys.exit('Disconnected, client: {0}'.format(client._client_id))

def on_connect(client, userdata, flags, rc):
    if(rc==0):
        print("connecting to broker ", broker)
        print("subscribing to topics ")
        client.subscribe(in_topic_1)
        client.subscribe(in_topic_2)
        client.subscribe(in_topic_3)
        client.subscribe("disconnect")
    elif(rc==3):
        print("server unavailable")
        client.loop_stop()
        sys.exit("Server is unavailable, please try later")
    elif(rc==5):
        print("Invalid Credentials")
        #client.disconnect()
        client.loop_stop()
        sys.exit('Invalid Credentials')
    else:
        print("Bad connection, returned code=",rc)
        client.loop_stop()
        sys.exit("Bad connection, returned code={0}".format(rc))



client= paho.Client("client-mass") 
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
# Callback for publish actions
# client.on_publish = on_publish

# Now we try to connect
try:
    client.connect(broker)#connect
except:
    sys.exit('Error connecting to broker')


#client.loop_start() #start loop to process received messages
client.loop_forever()

# client.disconnect() #disconnect
# client.loop_stop() #stop loop
