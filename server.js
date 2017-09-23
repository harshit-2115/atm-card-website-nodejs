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
	res.clearCookie('balance');
	getFileContent(res,'index.html','text/html');
});
app.get('/transactions', function(req, res){
	// getFileContent(res,'hello.html','text/html');
	if (!req.body) return res.sendStatus(400)
  	var con = mysql.createConnection({
  	host: "localhost",
  	user: "root",
  	password: "",
  	database:'mydb'});
  	var userA = req.cookies.account;  
  	console.log("in here");
  	con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  var sql = "Select * FROM transactions WHERE account='" + userA + "'" ;
		  res.write(" <!DOCTYPE html> <html> <head> <title>MasterCard Services</title> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, shrink-to-fit=no\"> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\"> <link rel=\"stylesheet\" href=\"style.css\"> <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script> <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js\" integrity=\"sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1\" crossorigin=\"anonymous\"></script> <script src=\"main.js\" type=\"text/javascript\"></script> </head> <body> <body> <div id=\"wrapper\" class=\"container-fluid\"> <main class=\"col-sm-9 col-md-10\" role=\"main\"> <div class=\"table-responsive row\"> <h2>Transaction Details</h2> <table class=\"table table-striped\"> <thead><tr> <th>#</th> <th>Date</th> <th>From/To</th> <th>Debit</th> <th>Credit</th> </tr></thead> <tbody>");
		 	con.query(sql, function (err, result) {
		  	if (err) throw err;
		    for(var i = 0; i < result.length; i++) {
 					res.write("<tr><td>"+(i+1)+"</td> <td>"+result[i].date+"</td> <td>"+result[i].party+"</td> <td>"+result[i].debit+"</td> <td>"+result[i].credit+"</td></tr>")
				}
				res.write("</tbody> </table> </div> <button type=\"btn btn-primary\"><a href=\"dashboard\">Back</a></button> </main> </div> </body> </html>");
		  });
	});
});
app.get('/dashboard', function(req, res){
	
	if(req.cookies.Email)
  		getFileContent(res,'dashboard.html','text/html')
else
	res.redirect('/');
});
app.get('/error', function(req, res){
	res.write("<!DOCTYPE html> <html> <head> <title>Error Page</title> </head> <body> <h2>Error Page</h2> <form action=\"/dashboard\"> <p>Some Error Occured or you entered wrong details.</p> <button>Back</button> </form> </body> </html>");
});
app.get('/logout', function(req, res){
	if(req.cookies.Email){
	res.clearCookie('Email');
	res.clearCookie('account');
	res.clearCookie('name');
	res.clearCookie('balance');
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
  var name = req.cookies.Email;
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
			  	res.cookie('balance', result[0].balance, { expires: new Date(Date.now() + 86400000), httpOnly: false });
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
		  	var balance1 = req.cookies.balance;
		  	var sql1 = "Select name,balance FROM customers WHERE account='" + userA + "'";
		  	console.log("1 milestone");
			con.query(sql1, function (err, result) {
		  	// console.log(result[0].password);
		  	// console.log(userP);
		    if (err) throw err;
			if (result.length == 0) {
		    		res.redirect("/error");
			    	res.end();
			    }
			    else{
						if (result[0].name) {
		    				console.log(result[0]);
		    				var name = result[0].name;
		    				var balance = result[0].balance;
		    				if ((balance-userP) >= 0) 
		    				{
			    				var sql = "INSERT into transactions(account,credit,debit,party,date) VALUES('"+userA+"','"+userP+"',0,'"+sendname+"','"+  dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() +"')";
			    				var sql2 = "INSERT into transactions(account,debit,credit,party,date) VALUES('"+sendaccount+"','"+userP+"',0,'"+name+"','"+  dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() +"')";
			    				var final = balance*1+(userP*1);
			    				var sql3 = "UPDATE customers SET balance='"+final+"' WHERE account='"+userA+"'";
			    				var sql4 = "UPDATE customers SET balance='"+(balance1*1-userP*1)+"' WHERE account='"+sendaccount+"'";

			    				con.query(sql, function (err, result1) {
							    	console.log(result1);
								if (err) throw err;
							    con.query(sql2, function (err, result2) {
							    	console.log(result2);
							  	if (err) throw err;
								con.query(sql3, function (err, result3) {
							    	console.log(result3);
							  	if (err) throw err;
							    con.query(sql4, function (err, result4) {
							    	console.log(result4);
								if (err) throw err;
								res.cookie('balance', (balance1*1-userP*1), { expires: new Date(Date.now() + 86400000), httpOnly: false });
							    res.send("<!DOCTYPE html><html><head><title></title></head><body style=\"position: relative;\"><form action=\"/dashboard\"><h1>Successfully Done.</h1><button class=\"btn btn-primary\">Back</button></form></body></html>");
							  });
							  });
				
							  });
							  });
							 }else{
							 	res.redirect("/error");
							 }   
						}
						else{
							res.send("<!DOCTYPE html><html><head><title></title></head><body style=\"position: relative;\"><form action=\"/dashboard\"><h1>Error</h1><button class=\"btn btn-primary\">Back</button></form></body></html>");
						}
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
		  	res.cookie('balance', minBal, { expires: new Date(Date.now() + 86400000), httpOnly: false });
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

