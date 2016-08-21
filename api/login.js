var players = require('../src/session/players');
var session = require('../src/session/sessionId');

var io = null;

function login(req, res) {
  var playerId = session.getSessionIdFromCookie(req);
  var player = players.getPlayer(playerId);
  var name = req.body.name;
  var nameIsValid = name && name.match(/^[A-Za-z0-9_ \-!?[\]()]{3,}$/);

  if (player === null && nameIsValid) {
    playerId = players.createPlayer(name);

    if (playerId === null ) {
      res
      .status(400)
      .json({ error: 'This great name is already taken...'});
    } else {
      session.setSessionIdCookie(res, playerId);
      io.emit('player_joined');

      res
      .status(201)
      .json({ message: 'Welcome ' + name});
    }
  } else {
    res
    .status(202)
    .json({ message: 'Session valid or stolen....but hope not stolen as that would imply you are a bad person.'});
  }
}

function sessionStatus(req, res) {
  var playerId = session.getSessionIdFromCookie(req);
  var player = players.getPlayer(playerId);

  if (player === null) {
    res
    .status(401)
    .json({ message: 'No session found.'});
  } else {
    res
    .status(200)
    .json({ message: 'Welcome ' + player.name});
  }
}

function loginWithIo(ioHandler) {
  io = ioHandler;

  return login;
}
module.exports = {
  loginWithIo,
  sessionStatus,
}
