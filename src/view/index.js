var Handlebars = require('handlebars');
var fs = require('fs');
require('./index.hbs'); //for nodemon to reload
var Field = require('../Field');
var players = require('../session/players');
var sessionId = require('../session/sessionId');

function renderView(req, res) {
  fs.readFile(__dirname + '/index.hbs', 'utf8', function (err,data) {
    if (err) {
      console.log('Could not read file: ', err);
      res.send('error');
    }

    var playerId = sessionId.getSessionIdFromCookie(req);
    var player = players.getPlayer(playerId) || {};

    var template = Handlebars.compile(data);
    var context = {
      playerId,
      field: player.field,
    };

    var html = template(context);
    res.send(html);
  });
}

module.exports = renderView;
