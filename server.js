// MODULES
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var mysql = require('mysql');
var cookieParser = require('cookie-parser')
// OBJECTS
var app = express();
app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('photos'));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var con = mysql.createConnection({
  	host: "localhost",
  	user: "root",
  	password: "",
  	database:'mydb'});
//GET AND POST REQUESTS
app.get('/', function(req, res){
	res.clearCookie('Email');
	res.clearCookie('account');
	res.clearCookie('name');
	getFileContent(res,'index.html','text/html');
});
app.get('/dashboard', function(req, res){
	
	if(req.cookies.Email)
  		getFileContent(res,'dashboard.html','text/html')
else
	res.redirect('/');
});
app.get('/logout', function(req, res){
	if(req.cookies.Email){
	res.clearCookie('Email');
	res.clearCookie('account');
	res.clearCookie('name');
	res.redirect('/');
}
else
	res.redirect('/');
});
app.post('/upload', (req, res) => {
	if (!req.files)
    return res.status(400).send('No files were uploaded.');
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.fileToUpload;
 // Use the mv() method to place the file somewhere on your server
  var name = req.cookies.name;
  sampleFile.mv("./photos/"+name+".jpg", function(err) {
    if (err)
      return res.status(500).send(err);
 		res.redirect("/dashboard");
  });
});
app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	var con = mysql.createConnection({
  	host: "localhost",
  	user: "root",
  	password: "",
  	database:'mydb'});
  	var userE = req.body.user_email;
  	var userP = req.body.user_password;  
  	console.log("in here");
  	con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  var sql = "Select * FROM customers WHERE email='" + userE + "'" ;
		  con.query(sql, function (err, result) {
		  	// console.log(result[0].password);
		  	// console.log(userP);
		    if (err) throw err;
		    if (userP === result[0].password) {
		    	res.cookie('Email', userE, { expires: new Date(Date.now() + 86400000), httpOnly: false });
			  	res.cookie('account', result[0].account, { expires: new Date(Date.now() + 86400000), httpOnly: false });
			  	res.cookie('name', result[0].name, { expires: new Date(Date.now() + 86400000), httpOnly: false });
		    	res.redirect('/dashboard');
			}
		    else{
		    	res.redirect('/error');
		    }
		  });
	});
});
app.post('/payamt', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	var con = mysql.createConnection({
  	host: "localhost",
  	user: "root",
  	password: "",
  	database:'mydb'});
  	var userA = req.body.account_num;
  	var userP = req.body.pay_amt;  
  	con.connect(function(err) {
		  	if (err) throw err;
		  	console.log("PAYConnected!");
		  	var dt = new Date();
		  	var sendname = req.cookies.name;
		  	var sendaccount = req.cookies.account;
		  	var sql1 = "Select name FROM customers WHERE account='" + userA + "'";
		  	console.log("1 milestone");
			con.query(sql1, function (err, result) {
		  	// console.log(result[0].password);
		  	// console.log(userP);
		    if (err) throw err;
		    			if (result[0].name) {
		    				console.log(result[0].name);
		    				var name = result[0].name;
		    				console.log("2 milestone");
		    				var sql = "INSERT into transactions(account,credit,debit,recname,sendname,date) VALUES('"+userA+"','"+userP+"',0,'"+name+"','"+sendname+"','"+  dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() +"')";
		    				var sql2 = "INSERT into transactions(account,debit,credit,recname,sendname,date) VALUES('"+sendaccount+"','"+userP+"',0,'"+name+"','"+sendname+"','"+  dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() +"')";
						    con.query(sql, function (err, result1) {
						    	console.log(result1);
						  	// console.log(result[0].password);
						  	// console.log(userP);
						    if (err) throw err;
						    con.query(sql2, function (err, result2) {
						    	console.log(result2);
						  	// console.log(result[0].password);
						  	// console.log(userP);
						    if (err) throw err;
						    res.send("<!DOCTYPE html><html><head><title></title></head><body style=\"position: relative;\"><form action=\"/dashboard\"><h1>Successfully Done.</h1><button class=\"btn btn-primary\">Back</button></form></body></html>");
						  });
						  });
						}
						else{
							res.send("<!DOCTYPE html><html><head><title></title></head><body style=\"position: relative;\"><form action=\"/dashboard\"><h1>Error</h1><button class=\"btn btn-primary\">Back</button></form></body></html>");
						}
		});
	});
});
app.post('/settings', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	var con = mysql.createConnection({
  	host: "localhost",
  	user: "root",
  	password: "",
  	database:'mydb'});
  	var userA = req.body.password;
  	var userP = req.body.contact;  
  	con.connect(function(err) {
		  	if (err) throw err;
		  	console.log("SettingsConnected!");
		  	var userE = req.cookies.Email;
		  	var sql = "UPDATE customers SET password='"+userA+"',phone='"+userP+"' WHERE email='"+userE+"'";
		  	con.query(sql, function (err, result2) {
						    if (err) throw err;
						    res.send("<!DOCTYPE html><html><head><title></title></head><body style=\"position: relative;\"><form action=\"/dashboard\"><h1>Successfully Done.</h1><button class=\"btn btn-primary\">Back</button></form></body></html>");
						  });
	});
});
app.post('/signup', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	var con = mysql.createConnection({
  	host: "localhost",
  	user: "root",
  	password: "",
  	database:'mydb'});
  	var userN = req.body.name;
  	var userE = req.body.email;
  	var userP = req.body.password;  
  	var userC = req.body.contact;
  	var AccNo = req.body.account;
  	var minBal = 10000;
  	var tran = 0;
  	con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  var sql = "INSERT INTO customers (name, email,password,phone,account,debit,credit,balance) VALUES ('"+userN+"','"+userE+"','"+userP+"','"+userC+"','"+AccNo+"','"+tran+"','"+tran+"','"+minBal+"')"; 
		  // console.log(sql);
		  con.query(sql, function (error, result) {
		  	// console.log(result);
		  	if (error) throw error;
		  	res.cookie('Email', userE, { expires: new Date(Date.now() + 86400000), httpOnly: false });
		  	res.cookie('account', AccNo, { expires: new Date(Date.now() + 86400000), httpOnly: false });
		  	res.cookie('name', userN, { expires: new Date(Date.now() + 86400000), httpOnly: false });
		    res.redirect('/dashboard');
		  });
	});
});
app.listen(8080);
//FUNCTIONS
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

