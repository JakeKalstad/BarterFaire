var express = require('express');
var router = express.Router();
router.post('/index', function(req, res) {
  res.render('');
});
module.exports = router;