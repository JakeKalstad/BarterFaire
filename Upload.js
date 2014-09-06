var fs = require('fs');

module.exports = {
    UploadFile : function(file, filename, callBack){
        var fstream = fs.createWriteStream(__dirname + '/public/upload/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
           callBack();
        });
    }
};