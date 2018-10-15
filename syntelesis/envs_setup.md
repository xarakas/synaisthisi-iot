# Project Tech Infos

## GIT Infos
### server side:
$ mkdir project.git  
$ cd project.git  
$ git init --bare  

### client side:
$ git remote add origin vpitsilis@192.168.10.23:/home/vpitsilis/git/project.git  
$ git push -u origin master  

### 3rd party client:
$ git clone vpitsilis@192.168.10.23:/home/vpitsilis/git/project.git  

## SERVER side installation infos
### Create new user if needed
$ sudo adduser vpitsilis

### Add user to sudoers
$ visudo
Add line (under root)
vpitsilis ALL=(ALL:ALL) ALL

### sshd conf
$ vim /etc/ssh/ssd_conf
AllowRootLogin False
AllowUsers vpitsilis

### Postgres setup
sudo apt-get install postgresql, postgresql-contrib
Right after insallation:
$ sudo -i -u postgres
(postgres)$ psql
=# \conninfo
Create new posgtgres user (same name as unix user):
(postgres)$ createuser vpitsilis -P
(postgres)$ createdb db_name & exit
Connect to db
$ psql -h <host> -p <port> -u <database>
  or
$ psql -h <host> -p <port> -U <username> -W <password> <database>
$ sudo vim /etc/postgresql/9.5/main/pg_hba.conf
"local" is for Unix domain socket connections only
local   all             all                                     peer => md5
or be more specific
local   vpitsilis       syndelesis                              md5
In order to take effect we need to SIGHUP postgres
$ kill -1 'postgres_process_id'

### Nginx
$ sudo apt-get install nginx
$ systemctl status (start,stop,restart) nginx

### Firewall configuration
If ufw is used:
$ sudo ufw enable
$ sudo allow ssh
$ sudo ufw allow 'Nginx HTTP'
$ sudo ufw status
If iptables is used:
...TBD

### nginx site configuration 
$ vim /etc/nginx/sites-available/syndelesis.conf
#### syndelesis.conf file
server {
  listen 80;
  real_ip_header X-Forwarded-For;  // Forward to flask requester IP address
  set_real_ip_from 127.0.0.1;       // Tell flask request is coming from localhost
  server_name localhost;

  location / {
    include uwsgi_params; // we are running the app using uwsgi (python app, see requirements file)
    uwsgi_pass unix:/var/www/html/syndelesis/socket.sock;   // comunication of flask with nginx
    uwsgi_modifier1 30;
  }
}

and then
$ sudo ln -s /etc/nginx/sites-available/syndelesis.conf /etc/nginx/sites-enabled/syndelesis.conf

#### If we want to use TLS
$ sudo mkdir -p /etc/ssl/localcerts
$ openssl req -new -x509 -days 365 -nodes -out ./nginx.pem -keyout ./nginx.key
Or just copy certificates (pem, key) in /etc/ssl/localcerts, and then:
$ vim syndelesis.conf
server {
  listen 443 default_server;
  server_name localhost;
  ssl on;
  ssl_certificate /etc/ssl/localcerts/nginx.pem
  ssl_certificate_key /etc/ssl/localcerts/nginx.key
  real_ip_header X-Forwarded-For;  // Forward to flask requester IP address
  set_real_ip_from 127.0.0.1;       // Tell flask request is coming from localhost

  location / {
    include uwsgi_params; // we are running the app using uwsgi (python app, see requirements file)
    uwsgi_pass unix:/var/www/html/syndelesis/socket.sock;   // comunication of flask with nginx
    uwsgi_modifier1 30;
  }
}

server {
  listen 80;
  server_name localhost;
  rewrite ^/(.*) https://192.168.1.30/$1 permanent;
}

#### Create content folder
$ sudo mkdir /var/www/html/syndelesis
$ sudo chown vpitsilis:vpitsilis /var/www/html/syndelesis-rest (change folder ownership)
$ cd /var/www/html/syndelesis
$ git clone syndelesis-code.git .
OR
$ scp code .....
$ mkdir log  (create logs folder for application)
$ sudo apt-get install python-pip python3-dev (<--for uwsgi compile) libpq-dev (<--for psycopg2)
$ pip install virtualenv
$ sudo /usr/bin/easy_install virtualenv // to put it in /usr/bin
$ virtualenv venv --python=python3.6
$ source venv/bin/activate
$ pip install -r requirements.txt
(Here uwsgi python package is included which provides 'venv/bin/uwsgi)

#### Create System Service
sudo vim /etc/systemd/system/uwsgi_syndelesis.service

[Unit]
Description=uWSGI Syndelesis

[Service]
Environment=DATABASE_URL=postgres://vpitsilis:qwerty@localhost:5432/syndelesis
ExecStart=/var/www/html/syndelesis/venv/bin/uwsgi --master --emperor /var/www/html/syndelesis/uwsgi.ini --die-on-term --uid vpitsilis --gid vpitsilis --logto /var/www/html/syndelesis/log/emperor.log
Restart=always
KillSignal=SIGQUIT
Type=notify
NotifyAccess=all

[Install]
WantedBy=multi-user.target

** DATABASE_URL is imported in flask config by os.environ.get('DATABASE_URL')
*** MISSING: start service at system boot (include it in init.d)

#### Create uwsgi.ini
$ vim /var/www/html/syndelesis/uwsgi.ini

[uwsgi]
base = /var/www/html/syndelesis
app = run
module = %(app)

home = %(base)/venv
pythonpath = %(base)

socket = %(base)/socket.sock
chmod-socket = 777

processes = 8
threads = 8

harakiri = 15

callable = app

logto = /var/www/html/syndelesis/log/%n.log


#### Just before running ....
DO NOT forget:
$ sudo rm /etc/nginx/sites-enabled/default
$ sudo systemctl reload nginx
$ sudo systemctl restart nginx
$ sudo systemctl start uwsgi-syndelesis
$ sudo systemctl enable  uwsgi_syndelesis   # IMPORTANT: to enable service at boot
$ vim views.py 
   and remove ng build/serve etc
$ vim syndelesis config.py startup.py 
   and put Production values


### Mosquitto Broker related staff
$ apt-get install mosquitto mosquitto-auth-plugin mosquitto-clients
$ sudo vim /etc/mosquitto/conf.d/auth-plugin.conf
  auth_plugin /usr/lib/mosquitto-auth-plugin/auth-plugin.so
  auth_opt_backends http
  auth_opt_http_ip 127.0.0.1
  auth_opt_http_port
  #auth_opt_http_hostname example.org
  auth_opt_http_getuser_uri /mqtt/auth
  auth_opt_http_superuser_uri /mqtt/superuser
  auth_opt_http_aclcheck_uri /mqtt/acl

#### Test with 
$ mosquitto_sub -h localhost -t topic3 -u vpitsilis -P qwerty [-i client_sub]
$ mosquitto_pub -h localhost -t topic3 -u vpitsilis -P qwerty -m "Hello" [-i client_pub]
[ Some versions -stable??- do not send acl and super if no client is included ]
 



### install Python and make virtual environment
$ apt-get install python3 virtualenv  
$ virtualenv venv --python=python3.6
$ source venv/bin/activate  
(vevn)$ pip install -r requirements.txt  


### db migrations
#### if not using Flask-Script
$ export FLASK_APP=run.py
$ flask db init  (--> creates migrations folder which needs to be in source control)
$ flask db migrate (--> creates new migrate file reflecting models changes)
$ flask upgrade (--> apply migration to db)
 i)  Then each time the database models change repeat the migrate and upgrade commands.
 ii) To sync the database in another system just refresh the migrations folder from source control and run the upgrade command.

Environment variable FLASK_APP can also be exported in virtualenv activate file.
e.g. add "export FLASK_APP=/path/to/hello.py" to the end of file
#### when using Flask-Script
TBD

## ftp server set up
A.
$ sudo apt-get update
$ sudo apt-get install vsftpd

B.
$ sudo adduser synftp

$ sudo mkdir /home/synftp/ftp
$ sudo chown nobody:nogroup /home/synftp/ftp
$ sudo chmod a-w /home/synftp/ftp

$ sudo mkdir /home/synftp/ftp/files
$ sudo chown synftp:synftp /home/sammy/ftp/files

C. (Remeber to add download deny)
$ sudo nano /etc/vsftpd.conf

 #Allow anonymous FTP? (Disabled by default).
anonymous_enable=NO
 #
 #Uncomment this to allow local users to log in.
local_enable=YES

write_enable=YES

chroot_local_user=YES

user_sub_token=$USER
local_root=/home/$USER/ftp

pasv_min_port=40000
pasv_max_port=50000

listen_port=45000

userlist_enable=YES
userlist_file=/etc/vsftpd.userlist
userlist_deny=NO

$ echo "synftp" | sudo tee -a /etc/vsftpd.userlist
$ sudo systemctl restart vsftpd

D.
 Add SSL/TLS

Ref:
  https://www.digitalocean.com/community/tutorials/how-to-set-up-vsftpd-for-a-user-s-directory-on-ubuntu-16-04
  http://vsftpd.beasts.org/vsftpd_conf.html




#### Quick (tested working) brief

$ sudo vim /etc/nginx/sites-available/syndelesis.conf

$ vim /var/www/html/syndelesis-rest/uwsgi.ini

$ sudo vim /etc/systemd/system/uwsgi_syndelesis.service


$ sudo rm /etc/nginx/sites-enabled/default
$ sudo systemctl reload nginx
$ sudo systemctl restart nginx
$ sudo systemctl start uwsgi_syndelesis

If it is not working probably service has not started so just run
$ sudo systemctl start uwsgi_syndelesis

## Brief explanation of the above

a) Nginx is informed and configured for a site running (available) with the conf file:
     /etc/nginx/sites-available/syndelesis.con
   In this file nginx is told to use /var/www/html/syndelesis-rest/socket.sock for communication with our app
b) uwsgi (responsible for running our flask app) is configured in conf file
     /var/www/html/syndelesis/uwsgi.ini
   how to run our app. There we tell uwsgi to use (socket = %(base)/socket.sock) the same socket as earlier defined in nginx configuration
c) We create a system service with this file:
     /etc/systemd/system/uwsgi_syndelesis.service
   Which starts (sudo systemctl ...) the uwsgi process which runs our flask app and writes/reads to socket.sock to communicate with nginx.
