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
parser.add_argument("--v1", metavar='m(kgr)', default=7, help="The mass")
parser.add_argument("--v2", metavar='V(m3)', default=2, help="The volume")
parser.add_argument("--input_topics", nargs='*', metavar='Input_topic', help='MQTT Broker Input Topics')
parser.add_argument("--output_topics", nargs='*', metavar='Input_topic',help='MQTT Broker Output Topics')

args = parser.parse_args()
v1=args.v1
v2=args.v2
in_topics = args.input_topics
out_topics = args.output_topics

# print("V1: {0}, V2: {1}".format(v1,v2))
# print("Input Topics: {0}, Output Topics: {1}".format(in_topics, out_topics))
# print("Type of: ", type(in_topics))
# for item in in_topics:
  # print(item)

in_topic_1 = in_topics[0]
in_topic_2 = in_topics[1]
in_topic_3 = in_topics[2]

out_topic_1 = out_topics[0]
out_topic_2 = out_topics[1]

print('IN TOPIC 1: ', in_topic_1)
print('OUT TOPIC 1: ', out_topic_1)

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
    print("DisConnected flags {0}, result code:{1}, client_id: {2} ".format(flags, rc, client._client_id))

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
        sys.exit(5)
    else:
        print("Bad connection, returned code=",rc)
        client.loop_stop()
        sys.exit("Bad connection, returned code={0}".format(rc))


#sys.exit('FUCK_OFF')

client= paho.Client("client-mass") #create client object client1.on_publish = on_publish #assign function to callback client1.connect(broker,port) #establish connection client1.publish("house/bulb1","on")

client.username_pw_set('dat_vpitsilis', 'qwerty')

######Bind function to callback
client.on_message=on_message
#####
client.on_log=on_log
client.on_connect=on_connect
client.on_disconnect=on_disconnect

#print("connecting to broker ",broker)
try:
    client.connect(broker)#connect
except:
    print("Error connecting")
    sys.exit(7)



#client.loop_start() #start loop to process received messages
client.loop_forever()

# client.disconnect() #disconnect
# client.loop_stop() #stop loop
