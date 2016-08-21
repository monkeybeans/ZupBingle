var PLAYER_COOKIE_NAME = 'player_id';

function getSessionIdFromCookie(req) {
  var playerId = req.cookies[PLAYER_COOKIE_NAME];

  return playerId;
}

function setSessionIdCookie(res, playerId) {
  res.cookie(PLAYER_COOKIE_NAME, playerId, { maxAge: 1000 * 3600 * 24, httpOnly: true });
}

function expireSessionCookie(res) {
  res.cookie(PLAYER_COOKIE_NAME, '', { maxAge: 0, httpOnly: true });
}


module.exports = {
  getSessionIdFromCookie,
  setSessionIdCookie,
  expireSessionCookie,
};
