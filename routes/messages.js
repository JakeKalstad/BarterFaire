var express = require('express'); 
var router = express.Router();

router.post('/viewmessages', function(req,res) { 
    res.render('messages');
});

router.post('/create', function(req, res){
   res.render('createMessage'); 
});

router.post('/viewmessage', function(req,res) { 
    res.render('message');
});

router.post('/newmessage', function(req, res){
    req.dataService.Posts.GetPost(req.body.postId, function(result) {
        req.body.recipientId = result.UserDataId;
        req.dataService.Messages.Insert(req.body, function(msg) {
            res.send({success:true});
        }); 
    });
});

router.post('/getmessages', function(req, res){
    req.dataService.Messages.Get(function(err, messages) {
        messages.forEach(function(msg) {msg.Title = msg.Title || 'n/a';});
        res.send(messages); 
    }, {recipientId : req.body.userId});
});

router.post('/messagedata', function(req,res) { 
    var messageId = req.body.id;
    req.dataService.Messages.GetMsg(messageId, function(message) { 
        res.send(message); 
    });
        
});

module.exports = router;