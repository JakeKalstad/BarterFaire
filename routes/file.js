var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var upload = require('../Upload');
var fs = require('fs');

router.post('/', function(req, res) {
  res.render('');
});

router.post('/uploadfiles', function(req, response) {
  fileCount = 0;
  req.pipe(req.busboy); 
  req.busboy.on('file', function (fieldname, file, filename, res) {
      fileCount++;
      upload.UploadFile(file, filename, function() {
          if(--fileCount == 0) {              
            response.send({success:true}); 
          }
      });
    }); 
});
module.exports = router;