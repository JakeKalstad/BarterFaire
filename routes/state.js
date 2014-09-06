var express = require('express');
var router = express.Router();

router.post('/index', function(req, res) { 
  res.render('stateList');
});

router.post('/getallstates', function(req, res) {
	req.dataService.States.Get(function (err, items) {
		items.forEach(function(itm) { 
			itm.Id = itm._id; 
			itm.imagePath = '/Images/States/' + itm.Name.trim().toLowerCase().replace(' ', '') + ".png";
		});
        res.json(items); 
    });
}); 


module.exports = router;