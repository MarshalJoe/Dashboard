var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var RETS = require('./retsData.js')

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log("User connected!");
});

function updateStats () {
	RETS.sendData(io);
}

setInterval(updateStats, 5000);

http.listen(3000, function(){
	console.log('listening on port 3000');
});

