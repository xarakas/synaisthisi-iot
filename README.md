# **Welcome!**

### In order to use our platform, first you have to create and run a local ![SYNAISTHISI][1] instance on your machine, via **Docker**.


Not to worry though! We have prepared a quick and easy guide on how to do it on your own:


>Before going into the guide, you should have **Docker** and **docker-compose** installed on your machine. If you haven't,  [*here's*][2] *Docker*'s official documentation page, where you'll find anything you might need.


## *The Guide:*
After installing **Docker** and **docker-compose** open a *Terminal*, and clone the repository. 
You will have to create a *.env* file, including values of critical environment variables. An example is given in *env_example.txt*. **We strongly recommend to change the default values**.


Then, run the following commands:

1.      cd synaisthisi-iot/docker_compose
2.      sudo docker-compose up



Interfaces and Ports:

80:   Platform portal and GUI

3000: HTTP/REST/MQTT-Websockets

1883: MQTT

5672: AMQP

5683/UDP: CoAP

8083: tomcat8 [(link)][7]

8080: oM2M [(link)][8] [(more info)][9]

15672: RabbitMQ

1880: NodeRED

### Architecture overview
![Architecture](https://github.com/xarakas/synaisthisi-iot/blob/a5968e9f8281209df442042ab1ccf870b0040028/Wiki-pages/Arch-Syn-ContFlat4.png)

#### When the process is completed, visit [localhost][3] from a local browser and you should be able to see the **SYNAISTHISI** Home page!

Also, check the following SYNAISTHISI user guide video:
[SYNAISTHISI User Guide][10]

 **For more advanced users:**

 To access any container through a terminal that executes on the virtualized environment:

>     sudo docker exec -ti <container_name> bash

 and... 

>     exit

 when you need to exit the virtualized environment.

 **Additional commands that could come in handy...**

 Stop any container from running:

>     sudo docker stop <container_name>

 Remove the container (**Warning!** If you want to also delete user accounts, topics, services, etc. you will need to delete the corresponding docker volumes.)

>     sudo docker rm <container_name>

...and that concludes the guide.

#### *Perfect! You can now start building your services using ![SYNAISTHISI][1] platform.*

## *MQTT Support*
You can use any client (e.g., [mosquitto][4], or [mqtt-cli][5], etc.).

## *CoAP Support*
You can use any client (e.g., [coap-cli][6], etc.). See also in folder examples/SimplePubSub/coap-cli :
>     node index.js put coap://<broker-ip>:5683/r/<your topic> -p <message>
>     node index.js get coap://<broker-ip>:5683/r/<your topic>
However, be sure to:

a. Set req.options\[2\].value of the message to be the username.

b. Set req.options\[3\].value of the message to be the password

## *HTTP/REST Support*
You can use any client or library.
However, be sure to include username and password in the headers.

E.g.: 

GET -> curl -H "username:\[your username\]" -H "password:\[your password\]" http://localhost:3000/resources/\[your_topic\]

PUT -> curl -X PUT -H "username:\[your username\]" -H "password:\[your password\]" -d '\[your message\]' http://localhost:3000/resources/\[your_topic\]

## For more info visit our Wiki pages: https://github.com/xarakas/synaisthisi-iot/wiki
 
## Related publications
[Journal paper:][11] Akasiadis, Charilaos, Vassilis Pitsilis, and Constantine D. Spyropoulos. 2019. "A Multi-Protocol IoT Platform Based on Open-Source Frameworks" Sensors, 19, no. 19: 4217. https://doi.org/10.3390/s19194217 
 
[Conference paper:][12] Pierris, Georgios, Dimosthenis Kothris, Evaggelos Spyrou, and Costas Spyropoulos. 2015. "SYNAISTHISI: an enabling platform for the current internet of things ecosystem". In Proceedings of the 19th Panhellenic Conference on Informatics (PCI '15). Association for Computing Machinery, New York, NY, USA, 438–444. https://doi.org/10.1145/2801948.2802019
 
## Disclaimer: 
 This repository is offered for research purposes. Please do not use this version in applications that require strict privacy, or that broadcast sensitive data.

[1]: https://github.com/xarakas/synaisthisi-iot/blob/a5968e9f8281209df442042ab1ccf870b0040028/Wiki-pages/synaisthisi_anim.gif "SYNAISTHISI gif"
[2]: https://docs.docker.com/ "Docker documentation"
[3]: http://localhost/ "localhost"
[4]: https://mosquitto.org/ "mosquitto"
[5]: https://www.npmjs.com/package/mqtt-cli "mqtt-cli"
[6]: https://github.com/mcollina/coap-cli "coap-cli"
[7]: http://localhost:8083/rdf4j-workbench/ "rdf4j-endpoint"
[8]: http://localhost:8080/webpage/welcome/index.html?context=/~&cseId=in-cse "OM2M-endpoint"
[9]: https://wiki.eclipse.org/OM2M/one/MQTT_Binding "oneM2M/MQTT binding info"
[10]: https://vimeo.com/375467068
[11]: https://www.mdpi.com/1424-8220/19/19/4217 "Journal paper:"
[12]: https://dl.acm.org/doi/abs/10.1145/2801948.2802019 "Conference paper:"
