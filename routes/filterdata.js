var express = require('express');
var router = express.Router();
router.post('/category', function(req, res) {
    req.dataService.Categories.Get(function (err, items) { 
        items.forEach(function(itm) {itm.Id = itm._id; itm.Title = itm.Name;});
        res.json(items); 
    }); 
});
module.exports = router;