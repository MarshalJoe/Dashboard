var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rets = require('./retsData.js')

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log("User connected!");
});

function updateStats () {
	rets.pullAndSendData(io);
}

setInterval(updateStats, 3000);

http.listen(3000, function(){
	console.log('listening on port 3000');
});

