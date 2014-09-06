var express = require('express');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router(); 
router.post('/index', function(req, res) { 
  res.render('locationList');
});
router.post('/getlocationbystate', function(req,res) {
    req.dataService.Locations.GetLocations(req.body.id, function(locations) {
        locations.forEach(function(loc) { loc.Count = 1; });
        res.send({ state:"where ever", locations : locations});
    });
});
module.exports = router;