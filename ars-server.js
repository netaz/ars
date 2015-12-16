var express   =   require("express");
var mysql     =   require('mysql');
var bodyParser=   require('body-parser')
var app       =   express();

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '1q2w3e',
    database : 'ars',
    debug    :  false
});

function create_ar(req, res) {
  pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }

      console.log('CREATE: connected as id ' + connection.threadId + '+' + req.body.Description);
      connection.query('insert into ARs (MeetingID, Status, Description, OpenDate, DueDate) values (?, ?, ?, ?, ?)',
                       [req.body.MeetingID, req.body.Status, req.body.Description, req.body.OpenDate, req.body.DueDate], function(err, result) {
        if (err) throw err
      });
  });
}

function update_ar(req, res) {
  pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('UPDATE connected as id ' + connection.threadId + ' AR=' + req.body.ArID);
      connection.query('update ARs set Status=?, Description=? where ArID=?', [req.body.Status, req.body.Description, req.body.ArID], function(err, result) {
        if (err) throw err
      });
  });
}

function delete_ar(req, res) {
  pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('DELETE (' + req.body.id + ') connected as id ' + connection.threadId + ' AR=' + req.body.id);
      connection.query('DELETE FROM ARs where ArID=?', [req.body.id], function(err, result) {
        if (err) throw err
      });
  });
}


function get_list(req,res) {
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        console.log('LIST: connected as id ' + connection.threadId);
        connection.query("select * from ARs",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
}

//app.use(express.bodyParser());
app.use(bodyParser.json())

// Event listeners
app.get("/list_ars",function(req,res) { get_list(req,res); });
app.post("/create_ar",function(req,res) { create_ar(req, res); });
app.post("/update_ar",function(req,res) { update_ar(req, res); });
app.post("/delete_ar",function(req,res) { delete_ar(req, res); });

app.use(express.static('public'));
app.listen(1337);
