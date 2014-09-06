var express = require('express');
var router = express.Router();

router.post('/index', function(req, res) {
  res.render('viewposts');
});

router.post('/GetPosts', function(req, res) { 
  res.render('viewposts');
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
    var state = req.body.state;
    req.dataService.Categories.Get(function(err, cats) { 
        req.dataService.Locations.GetLocations(state, function(locs) { 
            res.send({ Locations:locs, Categories:cats });  
        });
    });
});

module.exports = router;