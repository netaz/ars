var mysql = require('mysql');
var connection  = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1q2w3e',
    database : 'ars',
});

connection.connect();
connection.query('DROP TABLE ARs', function(err) {
  if (err)
    console.log('error');
});

connection.query(`CREATE TABLE ARs
  (
    ArID int not null auto_increment,
    MeetingID int Not NULL,
    OwnerID int,
    CreatorID int,
    Status enum('Open', 'Closed', 'Rejected', 'Deleted'),
    Description varchar(2048),
    OpenDate DATE,
    CloseDate DATE,
    DueDate DATE,
    PRIMARY KEY(ArID)
  )`, function(err) {
    if (err)
      console.log('error');
});

connection.query('DROP TABLE Users', function(err) {
  if (err)
    console.log('error');
});

connection.query(`CREATE TABLE Users
  (
    UserID int not null auto_increment,
    PRIMARY KEY(UserID ),
    LastName varchar(255),
    FirstName varchar(255),
    Email varchar(255)
  )`, function(err) {
    if (err)
      console.log('error');
});

connection.query('INSERT INTO Users (LastName, FirstName, Email) values (?, ?, ?)', ["", "Leonard", ""], function(err) {
  if (err)
    console.log('error');
});
connection.query('INSERT INTO Users (LastName, FirstName, Email) values (?, ?, ?)', ["", "Sheldon", ""], function(err) {
  if (err)
    console.log('error');
});
connection.query('INSERT INTO Users (LastName, FirstName, Email) values (?, ?, ?)', ["Wolowitz", "", ""], function(err) {
  if (err)
    console.log('error');
});


connection.end();
