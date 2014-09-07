var express = require('express');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router(); 
router.post('/index', function(req, res) { 
  res.render('locationList');
});
router.post('/getlocationbystate', function(req,res) { 
    console.log(req.body);
    req.dataService.Locations.GetLocations(req.body, function(locations) {
        locations.sort(function(l) { return -l.Count;});  
        res.send({ state:"where ever", locations : locations});
    });
});
module.exports = router;