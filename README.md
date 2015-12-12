# ars
A system for managing project "action-required items" (ARs)

To execute:
$ nodejs ars-server.js

At the backend I'm running node with several packages:
$ sudo apt-get install nodejs
$ npm init
$ npm install express
$ npm install mysql
$ npm install socket.io
$ npm install body-parser

I chose a relational database.  Despite the no-sql hype this just makes more sense here, and the joins that I will need, will be more effective than "manual joins" with e.g. mongodb.

$ sudo apt-get install mysql-server

To restart after making changes:
$ sudo service mysql restart

To login to the DB and create the tables:
$ mysql -u root -p
mysql> create database ars;
mysql> use ars;
mysql> CREATE TABLE ARs
(
ArID int not null auto_increment,
MeetingID int Not NULL,
OwnerID int,
Status varchar(255),
Summary varchar(255),
OpenDate DATE, 
PRIMARY KEY(ArID)
);
