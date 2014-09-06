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

module.exports = router;