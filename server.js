var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var api = require('./api/api');
var view = require('./src/view');
var login = require('./api/login');
var management = require('./api/management');
var players = require('./src/session/players');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var app = express();
var http;
var io;

http = http.Server(app);
io = socketIo(http);

app.use(cookieParser());
app.use(bodyParser());

app.use(express.static(__dirname + '/public'));

app.use(management);
app.get('/', view);
app.post('/login', login.loginWithIo(io));
app.get('/login', login.sessionStatus);
app.use('/api', api(io));


io.on('connection', function(socket){
  io.emit('player_joined');
  socket.on('disconnect', function(){
    io.emit('player_left');
 });
});


http.listen(server_port, server_ip_address, function () {
  var sysDate = new Date().toString();

  console.log('Listening on address: ' + server_ip_address + ':' + server_port);
  console.log('Time: ', sysDate);

  players.startPlayerCrowdExpiration();
});
