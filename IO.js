var socket = require('socket.io');

var io = io;

module.exports = {
    initialize : function(server) { 
        io = socket.listen(server);
        server.listen(8000);
    },
    Emit : function(tag, data) {
        io.emit(tag, data);
    },
    Listen : function(tag, handler) {
        io.on('connection', function (client) {
            client.on(tag, function(data) {
                handler(data);
            });
        });
    }
};