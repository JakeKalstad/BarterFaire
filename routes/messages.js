var io = require('./../IO');
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

router.post('/newmessage', function(req, res) {
    var insert = function() {
        req.dataService.Messages.Insert(req.body, function(msg) {
            io.Emit('messageCount'); 
            res.send({success:true});
        });
    }; 
    req.body.recipientId = req.body.senderId;
    req.body.senderId = req.session.Id;
    req.body.From = req.session.UserName; 
    if(req.body.recipientId) { 
        insert();
        return;
    } else {
        req.dataService.Posts.GetPost(req.body.postId, function(result) {
            req.body.recipientId = result.UserDataId;
            insert();
        });
    }
});

router.post('/getmessages', function(req, res){ 
    req.dataService.Messages.Get(function(err, messages) {
        count = messages.length;
        messages.forEach(function(msg) { 
            msg.Title = msg.Title || 'n/a';
            msg.isViewed = msg.isViewed || false; 
        });
        res.send(messages);
    }, {recipientId : req.session.Id});
});

router.post('/message_viewed', function(req,res) {   
    req.body._id = req.body._id || req.body.id;
    req.dataService.Messages.Update(req.body._id, { $set: { isViewed : true }}, function(er, ret) {
        res.send({ success: ret});
    }); 
});

module.exports = router;