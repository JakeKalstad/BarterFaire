var express = require('express'); 
var router = express.Router();  

function AccountResult(session, exception) {
	this.Id = session.Id; 
	this.Success = exception ? false : this.Id != -1;
	this.UserName = exception ? false : session.UserName;
	this.Email = exception ? false : session.Email;
	this.Error = (exception) ? exception.Message : ""; 
}

function setSession(session, user) {
    if(user){
    	session.Id = user.Id;
    	session.UserName = user.UserName;
    	session.Email = user.Email;
    	return;
	}
	session.Id = -1;
	session.UserName = '';
	session.Email = '';
}

router.post('/index', function(req,res) {
  res.render('login');
});

router.post('/manage', function(req,res) {
  res.render('manageaccount');
});
router.post('/register', function(req,res) {
  res.render('register');
}); 

router.post('/edit', function(req,res) { 
    if (!req.body.email)
        res.send({success : false, msg : "Neither email or password cannot be empty."}); 
    var callBack =  function(err, users) { 
        if(users.length > 0) {
            var user = users[0];
            user.Email = req.body.email || user.Email;
            req.encryption.cryptPassword(req.body.password, function(err, hash) { 
                user.Password = hash; 
                req.dataService.Users.Update(user, {$set:{Email:user.Email, Password : hash}}, function(err, coll) {
                    setSession(req.session, user); 
                    res.send(new AccountResult(req.session)); 
                });
            });
        } else {
            setSession(req.session, null); 
            res.send(new AccountResult(req.session));
        }
    };
    req.dataService.Users.Get(callBack, {'_id' : req.session.Id});
});

router.post('/newregister', function(req,res) {
	var username = req.body.UserName;
  	var password = req.body.Password; 
	var email = req.body.Email;
    console.log(username+" "+password+" "+email);
    req.encryption.cryptPassword(req.body.Password, function(err, hash) { 
        req.body.Password = hash;
        req.dataService.Users.Insert(req.body, function(err, collection) {
            setSession(req.session, req.body);
            console.log(req);
            res.send(new AccountResult(req.session));
        });
    });
});

router.post('/login', function(req,res) {
	var username = req.body.UserName;
  	var password = req.body.Password; 
  	var callBack = function(err, users) {
        if(users.length > 0) {
            var user = users[0];
            req.encryption.comparePassword(password, user.Password, function(err, isMatch) {
                if(isMatch)
                     setSession(req.session, user);   
                else
                    setSession(req.session, null);              
                res.send(new AccountResult(req.session));
            });
        } else {
            setSession(req.session, null); 
            res.send(new AccountResult(req.session));
        }
    };
    
  	req.dataService.Users.Get(callBack, {'UserName' : username});
});
    


router.post('/logoff', function(req,res) { 
    setSession(req.session, null);
    res.send(new AccountResult(req.session));
});

router.post('/userinfo', function(req, res) {  
  res.send(new AccountResult(req.session));
});

module.exports = router;