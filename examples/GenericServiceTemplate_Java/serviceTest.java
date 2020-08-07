import java.io.IOException;

import java.util.logging.Formatter;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MqttDefaultFilePersistence;

public class serviceTest implements MqttCallback {

    private static final Logger logger = Logger.getLogger(serviceTest.class.getName());

    public String in_topic_1;
    public String in_topic_2;
    public String in_topic_3;
    public String out_topic_1;
    public String out_topic_2;
    
    public static String getEnv(String env, String fallback) {
        String var = System.getenv(env);
        return var == null ? fallback : var;
    }

    public static void main(String[] args) {

        Handler fileHandler       = null;
        Formatter simpleFormatter = null;

        try {
            String path     = System.getProperty("user.dir");
            String name     = serviceTest.class.getName();
            String logName  = path + "/" + name + ".log";
            fileHandler     = new FileHandler(logName, true);

            logger.addHandler(fileHandler);

            fileHandler.setLevel(Level.ALL);
            logger.setLevel(Level.ALL);

            logger.info("Synaisthisi ok Service just started for service: " + name);

        } catch(IOException exception) {
            logger.log(Level.SEVERE, "Error occur in FileHandler.", exception);
        }

        String broker       = getEnv("BROKER", "localhost");
        String client       = getEnv("CLIENT_NAME", "");
        String username     = getEnv("username", "");
        String password     = getEnv("password", "");
        String in_topic1   = getEnv("in_topic_1", "");
        String in_topic2   = getEnv("in_topic_2", "");
        String in_topic3   = getEnv("in_topic_3", "");
        String out_topic1  = getEnv("out_topic_1", "");
        String out_topic2  = getEnv("out_topic_2", "");


        logger.info("Credentials: " + username + ":" + password);
        logger.info("BROKER: "      + broker);
        logger.info("in_topic_1: "  + in_topic1);
        logger.info("in_topic_2: "  + in_topic2);
        logger.info("in_topic_3: "  + in_topic3);
        logger.info("out_topic_1: "  + out_topic1);
        logger.info("out_topic_2: "  + out_topic2);

        String protocol     = "tcp://";
        String port         = ":1883";
        String url          = protocol + broker + port;
        String clientId     = client;
        int qos             = 1;

        try {
            serviceTest sampleClient = new serviceTest(url, clientId, username, password, in_topic1, in_topic2, in_topic3, out_topic1, out_topic2);

            sampleClient.subscribe(in_topic1,qos);
            sampleClient.subscribe(in_topic2,qos);
            sampleClient.subscribe(in_topic3,qos);
            while (true){

            }


        } catch(MqttException me) {
            System.out.println("reason " + me.getReasonCode());
            System.out.println("msg "    + me.getMessage());
            System.out.println("loc "    + me.getLocalizedMessage());
            System.out.println("cause "  + me.getCause());
            System.out.println("excep "  + me);
            me.printStackTrace();
        }
    }

    private boolean             clean;
    private MqttClient          client;
    private MqttConnectOptions  conOpt;
    private String              brokerUrl;
    private String              password;
    private String              username;

    public serviceTest(String brokerUrl,
                       String clientId,
                       String username,
                       String password,
                       String in_topic1,
                       String in_topic2,
                       String in_topic3,
                       String out_topic1,
                       String out_topic2) throws MqttException {

        this.brokerUrl = brokerUrl;
        this.password  = password;
        this.username  = username;
        this.in_topic_1 = in_topic1;
        this.in_topic_2 = in_topic2;
        this.in_topic_3 = in_topic3;
        this.out_topic_1 = out_topic1;
        this.out_topic_2 = out_topic2;

        String tmpDir = System.getProperty("java.io.tmpdir");
        MqttDefaultFilePersistence dataStore = new MqttDefaultFilePersistence(tmpDir);

        try {
            conOpt = new MqttConnectOptions();
            conOpt.setCleanSession(clean);
            if(password != null ) {
                conOpt.setPassword(this.password.toCharArray());
            }
            if(username != null) {
                conOpt.setUserName(this.username);
            }

            client = new MqttClient(this.brokerUrl, clientId, dataStore);
            client.setCallback(this);
            client.connect(conOpt);
        } catch (MqttException e) {
            e.printStackTrace();
            logger.info("Unable to set up client: " + e.toString());
            System.exit(1);
        }
    }

    public void publish(String topic, int qos, byte[] payload) throws MqttException {
        logger.info("Connecting to " + brokerUrl + " with client ID " + client.getClientId());
        // client.connect(conOpt);
        logger.info("Connected");

        MqttMessage message = new MqttMessage(payload);
        message.setQos(qos);

        logger.info("Publishing to topic \"" + topic + "\" qos " + qos);
        client.publish(topic, message);

    }

    public void subscribe(String topic, int qos) throws MqttException {
        // client.connect(conOpt);
        logger.info("Connected to " + brokerUrl + " with client ID " + client.getClientId());

        logger.info("Subscribing to topic \"" + topic + "\" qos " + qos);
        client.subscribe(topic, qos);

    }

    /* Start of MqttCallback methods implementation */
    public void connectionLost(Throwable cause) {
        logger.info("Connection to " + brokerUrl + " lost." + cause);
        System.exit(1);
    }

    public void deliveryComplete(IMqttDeliveryToken token) {
        logger.info("Delivery Complete.");
    }

    public void messageArrived(String topic, MqttMessage message) throws MqttException {
        logger.info("  Topic:\t" + topic +
            "  Message:\t" + new String(message.getPayload()) +
            "  QoS:\t" + message.getQos());
            String payload = new String(message.getPayload());
            if (topic.equals(this.in_topic_1)){
                    logger.info("Received in" + topic);
                    logger.info("Received in topic"+ topic +", Publishing in topic "+ this.out_topic_1 +", message => "+payload);
                    //MqttMessage msg = new MqttMessage(message.getPayload().getBytes());
                    this.publish(this.out_topic_1, 1, payload.getBytes());
                    }
            else if (topic.equals(this.in_topic_2)){
                    logger.info("Received in" + topic);
                    logger.info("Received in topic"+ topic +", Publishing in topic "+ this.out_topic_2 +", message => "+payload);
                    //MqttMessage msg = new MqttMessage(message.getPayload());
                    this.publish(this.out_topic_2, 1, payload.getBytes());
                    }
            else if (topic.equals(this.in_topic_3)){
                    logger.info("Received in" + topic);
                    logger.info("Received in topic"+ topic +", Publishing in topic "+ this.out_topic_2 +", message => "+payload);
                    //MqttMessage msg = new MqttMessage(message.getPayload());
                    this.publish(this.out_topic_2, 1, payload.getBytes());
                    }
            else{
                    logger.info("Unrecognized topic:" + topic);
                    logger.info("Do nothing");
                }
                    
    }
    
    /* End of MqttCallback methods implementation */

}
