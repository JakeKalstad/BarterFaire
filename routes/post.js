var express = require('express');
var router = express.Router();

router.post('/index', function(req, res) {
  res.render('viewposts');
});

router.post('/GetPosts', function(req, res) {
    req.dataService.Posts.GetPostPerLocation(req.body.locationId, function(result) {
      res.send(result); 
    });
});

router.post('/create', function(req, res) {
    res.render('createpost');    
});

router.post('/postdetail', function(req,res) {
    res.render('postdetail');
});

router.post('/getpost', function(req, res) {
    var post = req.dataService.Posts.GetPost(req.body.postId, function(result){
        result.Images = new Array();
        result.imageFiles.forEach(function(img) { result.Images.push("/upload/"+img);}); 
        res.send(result);
    });
});

router.post('/createpost', function(req, res){
    req.body.UserDataId = req.session.Id;
    console.log(req.session);
    if(!req.body.UserDataId) {
        res.send({ success : false, message : "Looks like you're not signed in, please sign in before making a post." });
        return;
    }
    console.log("logging request for create post");
    console.log(req);
    req.dataService.Posts.Insert(req.body, function(result) { 
        var id = result[0]._id;
        res.send({
            id : id,
            success : true, 
            message : "Congratulations, you have successfully posted " + req.body.Title + " keep an eye on your inbox for replies!" 
        });
    });
});

router.post('/GetCreationData', function(req, res) { 
    req.dataService.Categories.Get(function(err, cats) { 
        req.dataService.Locations.GetLocations({ id : req.body.state}, function(locs) { 
            res.send({ Locations:locs, Categories:cats });  
        });
    });
});

module.exports = router;