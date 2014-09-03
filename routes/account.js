var express = require('express');
var router = express.Router();

function AccountResult(session, exception) {
	this.Id = session.UserId; 
	this.Success = exception ? false : this.id != -1;
	this.UserName = exception ? false : session.UserEmai;
	this.Email = exception ? false : session.UserEmail;
	this.Error = (exception) ? exception.Message : ""; 
}
 
router.post('/userinfo', function(req, res) { 
  res.send(new AccountResult(req.session));
});

module.exports = router;