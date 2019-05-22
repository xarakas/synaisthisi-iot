# **Welcome!**

###In order to use our platform, first you have to create and run a local ![SYNAISTHISI][1] instance on your machine, via **Docker**.


Not to worry though! We have prepared a quick and easy guide on how to do it on your own:


>Before going into the guide, you should have **Docker** installed on your machine. If you haven't,  [*here's*][2] *Docker*'s official documentation page, where you'll find anything you might need.

## *The Guide:*
After installing **Docker** open a *Terminal* and run the following commands:


    1.      git clone https://<your_username>@bitbucket.org/xarakas/synaisthisi-container.git 
            (Be sure to replace your bitbucket username.)
    2.      cd synaisthisi-container
    3.      git submodule init
    4.      git config submodule.syntelesis.url "https://<your_username>@bitbucket.org/xarakas/syntelesis.git" 
    5.      git submodule update
    6.      cd syntelesis
    7.      git pull origin master
    8.      cd ..
    9.      sudo docker build --no-cache --rm=true --tag synaisthisi . 
            (Be sure to notice the last period! Do not remove it, it's required.)
    10.      sudo docker create -t --publish 8083:8083 --publish 3000:3000 --publish 8080:8080 --publish 9001:9001 --publish 5000:5000 --publish 5432:5432 --publish 1883:1883  --publish 1885:1885 --publish 15672:15672 --publish 80:80 --publish 5672:5672 --publish 5683:5683/udp -v /var/run/docker.sock:/var/run/docker.sock -v <folder on host>:/myfolder --name cont1 synaisthisi 
            (Be sure to replace <folder on host> with a folder on your machine that will be accesible from the container, in order to easily share your files.)
    11.     sudo docker start cont1 

Ports:
3000: HTTP/REST/MQTT-Websockets

1883: MQTT

5672: AMQP

5683: CoAP

8083: tomcat8

8080: oM2M

15672: RabbitMQ


#### When the process is completed, visit [localhost][3] from a local browser and you should be able to see the **SYNAISTHISI** Home page!

 **For more advanced users:**

 To access the container through a terminal that executes on the virtualized environment:

>     sudo docker exec -ti cont1 bash

 and... 

>     exit()

 when you need to exit the virtualized environment.

 **Additional commands that could come in handy...**

 Stop the container from running:

>     sudo docker stop cont1

 Remove the container (**Warning!** Requires repetition of step 9 in order to run it again, and all data of the container will be deleted, i.e. user accounts, registered topics and services, etc.):

>     sudo docker rm cont1

...and that concludes the guide.

#### *Perfect! You can now start building your services using ![SYNAISTHISI][1] platform.*

## *MQTT Support*
You can use any client (e.g., [mosquitto][4], or [mqtt-cli][5], etc.).

## *CoAP Support*
You can use any client (e.g., [coap-cli][6], etc.).
However, be sure to:

a. Set req.options\[2\].value of the message to be the username.

b. Set req.options\[3\].value of the message to be the password

## *HTTP/REST Support*
You can use any client or library.
However, be sure to include username and password in the headers.

E.g.: 

GET -> curl -H "username:<your username>" -H "password:<your password>" http://localhost:3000/resources/<your topic>

PUT -> curl -X PUT -H "username:<your username>" -H "password:<your password>" -d '<your message>' http://localhost:3000/resources/<your topic>


[1]: https://bitbucket.org/xarakas/syntelesis/raw/8e432c309c180daa0fb5a049928808dadf245075/syndelesis/ClientAppSyndelesis/dist/assets/synaisthisi_anim.gif "SYNAISTHISI gif"
[2]: https://docs.docker.com/ "Docker documentation"
[3]: http://localhost/ "localhost"
[4]: https://mosquitto.org/ "mosquitto"
[5]: https://www.npmjs.com/package/mqtt-cli "mqtt-cli"
[6]: https://github.com/mcollina/coap-cli "coap-cli"
