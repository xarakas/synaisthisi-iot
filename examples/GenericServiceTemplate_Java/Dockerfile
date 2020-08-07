FROM debian:buster

# Install java JRE, JDK and apache-maven
RUN apt-get update && apt-get install -y default-jre default-jdk git curl
RUN cd /usr/local && \
    curl http://mirrors.myaegean.gr/apache/maven/maven-3/3.6.2/binaries/apache-maven-3.6.2-bin.tar.gz | tar xz && \
    mv apache-maven-3.6.2 apache-maven && \
    printf "%s\n%s\n%s\n%s\n" \
           "export JAVA_HOME=/usr/lib/jvm/default-java" \
           "export M2_HOME=/usr/local/apache-maven" \
           "export MAVEN_HOME=/usr/local/apache-maven" \
           "export PATH=\${M2_HOME}/bin:\${PATH}" > /etc/profile.d/apache-maven.sh

# Build paho.mqtt.java from source
WORKDIR /root
RUN git clone https://github.com/eclipse/paho.mqtt.java.git && \
    cd paho.mqtt.java && \
    . /etc/profile.d/apache-maven.sh && \
    mvn package -DskipTests


RUN jar="/root/paho.mqtt.java" && \
    jar="$jar/org.eclipse.paho.client.mqttv3.repository" && \
    jar="$jar/target/repository/plugins" && \
    jar="$jar/org.eclipse.paho.client.mqttv3_1.2.2.jar" && \
    ln -s $jar ./org.eclipse.paho.client.mqttv3.jar
ADD ./serviceTest.java .

CMD ["java", "-cp", "org.eclipse.paho.client.mqttv3.jar", "serviceTest.java"]
