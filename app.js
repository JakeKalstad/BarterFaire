var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var session = require('express-session');
var encryption = require('./Encryption');
var dataService = require('./DataService');
var mongo = require('mongoskin');
var routes = require('./routes/index');
var users = require('./routes/users');
var account = require('./routes/account');
var state = require('./routes/state');
var location = require('./routes/location');
var category = require('./routes/category');
var file = require('./routes/file');
var filterdata = require('./routes/filterdata');
var post = require('./routes/post');
var dev = require('./routes/dev');

var db = mongo.db("mongodb://localhost:27017/", {
    native_parser : true
});
var dataService = dataService.GetDataService(db);

var app = express();
app.use(busboy());

app.use(bodyParser.urlencoded({ 
    extended : false
}));
app.use(bodyParser.json({ 
    strict : false
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    secret : '1234567890QWERTY'
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    console.log(req.body);
    req.dataService = dataService;
    req.encryption = encryption;
    next();
});

app.use('/', routes);
app.use('/account', account);
app.use('/state', state);
app.use('/location', location);
app.use('/category', category);
app.use('/file', file);
app.use('/filterdata', filterdata);
app.use('/post', post);
app.use('/dev', dev);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message : err.message,
            error : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message : err.message,
        error : {}
    });
});

module.exports = app;
