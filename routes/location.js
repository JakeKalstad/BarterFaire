var express = require('express');
var router = express.Router();
router.post('/index', function(req, res) { 
  res.render('locationList');
});
router.post('/getlocationbystate', function(req,res) { 
           var location = new Object();
           location.Name = "Eugene";
           location.Id = 1;
           location.Count = 5;
           var locations = [location, location, location];
           res.send({ state:"where ever", locations : locations}); 
});
module.exports = router;