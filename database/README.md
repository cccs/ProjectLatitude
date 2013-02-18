used Database: MongoDB (http://www.mongodb.org/)
Installation for Ubuntu: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
Ubuntu Installation
Execute as root:
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list
apt-get update
apt-get install mongodb-10gen

Installation of MongoDB nodejs-Driver (mongoskin):
Executed commands:
npm install mongoskin

Resources: https://wiki.10gen.com/display/DOCS/node.JS, https://github.com/kissjs/node-mongoskin