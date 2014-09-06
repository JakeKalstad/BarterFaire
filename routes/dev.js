var express = require('express');
var router = express.Router();

var states = 
[{ Name : 'Alabama' }, 
{ Name : 'Alaska' },
{ Name : 'Arkansas' },
{ Name : 'California' },
{ Name : 'Colorado' },
{ Name : 'Connecticut' },
{ Name : 'Delaware' },
{ Name : 'Florida' },
{ Name : 'Georgia' },
{ Name : 'Hawaii' },
{ Name : 'Idaho' },
{ Name : 'Illinois' },
{ Name : 'Indiana' },
{ Name : 'Iowa' },
{ Name : 'Kansas' },
{ Name : 'Kentucky' },
{ Name : 'Louisiana' },
{ Name : 'Maine' },
{ Name : 'Maryland' },
{ Name : 'Massachusetts' },
{ Name : 'Michigan' },
{ Name : 'Minnesota' },
{ Name : 'Mississippi' },
{ Name : 'Missouri' },
{ Name : 'Montana' },
{ Name : 'Nebraska' },
{ Name : 'Nevada' },
{ Name : 'New Hampshire' },
{ Name : 'New Jersey' },
{ Name : 'New Mexico' },
{ Name : 'New York' },
{ Name : 'North Carolina' },
{ Name : 'North Dakota' },
{ Name : 'Ohio' },
{ Name : 'Oklahoma' },
{ Name : 'Oregon' },
{ Name : 'Pennsylvania' },
{ Name : 'Rhode Island' },
{ Name : 'South Carolina' },
{ Name : 'South Dakota' },
{ Name : 'Tennessee' },
{ Name : 'Texas' },
{ Name : 'Utah' },
{ Name : 'Vermont' },
{ Name : 'Virginia' },
{ Name : 'Washington' },
{ Name : 'Wisconsin' },
{ Name : 'Wyoming' }];

var categories = [
    { Name : "Auto"},
    { Name : "Electronics"},
    { Name : "Community"},
    { Name : "Music"}
];

var popCount = 0;
function complete(res) {
    console.log(popCount);
    if(--popCount == 0)
        res.send({msg : 'complete!'});
}
function populate(coll, data,req, res) {
    popCount++; 
    req.dataService.Remove(coll, {}, function(err, numberRemoved) { 
       console.log("Removed" + numberRemoved + " records from collection: " + coll);
       req.dataService.Insert(coll, data, function(err1, result) { 
            complete(res);        
        });    
    }); 
}

router.post('/seed', function(req,res) {
    console.log('seed...');
    populate('states', states, req, res);
    console.log('seed...');
    populate('categories', categories, req, res); 
    console.log('seed...');
});

module.exports = router;