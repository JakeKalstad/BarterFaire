var express = require('express');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router(); 
router.post('/index', function(req, res) { 
  res.render('locationList');
});

function setLocationName(location, indx) {
    var countyIndx = location.Name.indexOf(indx);
    if(countyIndx != -1) {
        location.Name = location.Name.slice(0, countyIndx);
    }
}

function stripSuffix(location) {
    setLocationName(location, "County");
    setLocationName(location, "Burough");
    setLocationName(location, "Parish"); 
    console.log(location.Name + " | " + location.Name.indexOf("County")); 
}

router.post('/getlocationbystate', function(req,res) { 
    console.log(req.body);
    var stateName = '';
    req.dataService.States.GetOne(req.body.id, function(state) {
        req.dataService.Locations.GetLocations(req.body, function(locations) {
            locations.sort(function(l) { return -l.Count;});
            
            locations.forEach(stripSuffix);
            
            if(state)
                res.send({ state:state.Name, locations : locations});
            else res.send({state : "-1", locations : []});
        });
    });
});
module.exports = router;