var router = require('express').Router();
var session = require('../src/session/sessionId');
var players = require('../src/session/players');
var io = null;

function getPlayer(req) {
  var sessionId = session.getSessionIdFromCookie(req);
  var player = players.getPlayer(sessionId);

  return player;
}

router.use((req, res, next) => {
  var player = getPlayer(req);

  if (!player) {
    res
    .status(401)
    .json({ error: 'Missing session.'});
  } else {
    next();
  }
});

router.get('/player/stats', (req, res) => {
  var player = getPlayer(req);

  res.json({
    name: player.name,
    numSelected: player.field.getNumberOfSelectedTiles(),
    numBingos: player.field.getNumberOfBingos(),
  });
});

router.get('/crowd/stats', (req, res) => {
  var stats = players.getCrowdStats();
  res.json(stats);
});

router.get('/crowd/all', (req, res) => {
  var crowd = players.getTheWholeCrowd();
  res.json(crowd);
});

router.post('/player/remove', (req, res) => {
  var sessionId = session.getSessionIdFromCookie(req);

  var crowd = players.removePlayer(sessionId);
  io.emit('player_left');

  res
  .status(204)
  .json({'':''});
});

router.post('/player/select-tile', (req, res) => {
  var player = getPlayer(req);
  var coordinates = req.body;

  var selected = player.field.selectTile(coordinates.row, coordinates.col);

  var status = {
    name: player.name,
    new_bingo: player.field.newBingo,
    num_bingos: player.field.numBingos,
  };

  io.emit('player_selected_tile', status);

  res.status = 200;
  res.json({
    selected,
    error: []
  });
});

function routerWithIo(ioHandler) {
  io = ioHandler;

  return router;
}

module.exports = routerWithIo;
