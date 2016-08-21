var router = require('express').Router();
var session = require('../src/session/sessionId');
var players = require('../src/session/players');

function expireSessionIfPlayerExpired(req, res) {
  var playerId = session.getSessionIdFromCookie(req);
  var crowdCleared = false;

  if (playerId && !players.getPlayer(playerId)) {
    session.expireSessionCookie(res);
    crowdCleared = true;
  }

  return crowdCleared;
}

router.use((req, res, next) => {
  expireSessionIfPlayerExpired(req, res);

  next();
});

module.exports = router;
