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

router.post('/seed', function(req,res) {
	req.db.collection('states').remove({},function(err,numberRemoved){
       console.log("inside remove call back" + numberRemoved);
    });
	req.db.collection('states').insert(states, function(err, result){
        res.send((err === null) ? { msg: '' } : { msg: err });
    });
});

module.exports = router;