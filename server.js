// MODULES
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')
var mysql = require('mysql');
// OBJECTS
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//GET AND POST REQUESTS
app.get('/', function(req, res){
	getFileContent(res,'index.html','text/html');
});
app.get('/dashboard', function(req, res){
  getFileContent(res,'dashboard.html','text/html');
});

app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	var userE = req.body.user_email;
  	var userP = req.body.user_password;  
  	var con = mysql.createConnection({
  	host: "localhost",
  	user: "root",
  	password: "",
  	database:'mydb'});

	con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  var sql = "Select password FROM customers WHERE email='" + userE + "'" ;
		  con.query(sql, function (err, result) {
		  	// console.log(result[0].password);
		  	// console.log(userP);
		    if (err) throw err;
		    if (userP === result[0].password) {
		    	res.redirect('/dashboard');
		    }
		    else{
		    	res.redirect('/');
		    }
		  });
	});

});


app.post('/signup', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	var userN = req.body.name;
  	var userE = req.body.email;
  	var userP = req.body.password;  
  	var userC = req.body.contact;
  	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database:'mydb'
	});
	con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  var sql = "INSERT INTO customers (name, email,password,phone) VALUES ('"+userN+"','"+userE+"','"+userP+"','"+userC+"')"; 
		  // console.log(sql);
		  con.query(sql, function (error, result) {
		  	// console.log(result);
		  	if (error) throw error;
		  	res.redirect('/dashboard');
		  });
	});

});
app.listen(8080);

// FUNCTIONS
function getFileContent(res,filepath,content){
	fs.readFile(filepath, function(error,data){
		if (error) {
			res.writeHead(500,{'Content-Type':'text/plain'});
			res.end('500 - Internal Server Error');
		}
		if (data) {
			res.writeHead(200,{'Content-Type':content});
			res.end(data);
		}
	});
}
function confirmLogin(userE, userP)
{
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database:'mydb'
	});
	con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  var sql = "Select password FROM customers WHERE email='" + userE + "'" ;
		  con.query(sql, function (err, result) {
		  	// console.log(result[0].password);
		  	// console.log(userP);
		    if (err) throw err;
		    if (userP === result[0].password) {
		    	console.log('true');
		    }
		    else{
		    console.log('false');
		    	
		    }
		  });
	});
}
function signUp(userN,userE, userP,userC){
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database:'mydb'
	});
	con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  var sql = "INSERT INTO customers (name, email,password,phone) VALUES ('"+userN+"','"+userE+"','"+userP+"','"+userC+"')"; 
		  // console.log(sql);
		  con.query(sql, function (error, result) {
		  	// console.log(result);
		  	if (error) throw error;
		  	res.redirect('/dashboard');
		  });
	});
}