var express = require('express');
var session = require('express-session'); 
var router = express.Router();  

function AccountResult(exception) {
	this.Id = session.Id; 
	this.Success = exception ? false : this.id != -1;
	this.UserName = exception ? false : session.UserName;
	this.Email = exception ? false : session.Email;
	this.Error = (exception) ? exception.Message : ""; 
}

function setSession(user) {
	session.Id = user.Id;
	session.UserName = user.UserName;
	session.Email = user.Email;
}

router.post('/newregister', function(req,res) {
	var username = req.body.UserName;
  	var password = req.body.Password; 
	var email = req.body.Email;
  	var confPassword = req.body.ConfirmPassword; 
  	req.db.collection('barter', function(err, collection) {});
	setSession(req.session,null); 
    res.send( new AccountResult());	
});

router.post('/login', function(req,res) {
	var username = req.body.UserName;
  	var password = req.body.Password; 
  	console.log(username);
  	console.log(password);
	setSession({ Id:0, UserName:username, Email:"jake@jake.com"}); 
    res.send(new AccountResult());
});

router.post('/userinfo', function(req, res) {  
  res.send(new AccountResult(req.session));
});

module.exports = router;