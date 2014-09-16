var express = require('express');
var router = express.Router();

router.post('/index', function(req, res) { 
  res.render('stateList');
});

router.post('/getallstates', function(req, res) {
	req.dataService.States.Get(function (err, items) {
		items.sort({Name : ''}).forEach(function(itm) { 
			itm.Id = itm._id;
			itm.Name;
			itm.imagePath = '/Images/States/' + itm.Name.trim().replace(/\s+/g, '').replace(' ', '').toLowerCase() + ".png";
		});
        res.json(items); 
    });
}); 


module.exports = router;