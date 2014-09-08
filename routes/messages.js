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
        req.dataService.Messages.Insert(req.body, function(result) {
            res.send({success:true});
        }); 
    });
});

router.post('/getmessages', function(req, res){
    req.dataService.Messages.Get(function(err, messages) {
        res.send(messages);
    }, {recipientId : req.body.userId});
});

router.post('/messagedata', function(req,res) { 
    var messageId = req.body._id;
        
});

module.exports = router;