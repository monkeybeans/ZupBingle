var Player = require('../Player');
var uuid = require('uuid');

var MAX_CROWD_SIZE = 500;
var playerCrowd = {};
var expireTimeoutId = null;


function startPlayerCrowdExpiration() {
  var EXPIRE_HOUR = 5;
  var EXPIRE_CHECK_CYCLE_MS = 1000 * 60 * 35;
  var sysDate = new Date();
  var stockholmeTimexzoneOffsetMs = 1 * 1000 * 60 * 60 * 6; //running on EST aaargh
  var stockholmTime = new Date(sysDate.getTime() + stockholmeTimexzoneOffsetMs);

  var thisHour = stockholmTime.getHours();


  if (thisHour === EXPIRE_HOUR) {
    console.log('Clearing crowd: ', EXPIRE_HOUR, EXPIRE_CHECK_CYCLE_MS, thisHour);
    playerCrowd = {};
  }

  expireTimeoutId = setTimeout(startPlayerCrowdExpiration, EXPIRE_CHECK_CYCLE_MS);
  console.log('Expire data:', EXPIRE_HOUR, EXPIRE_CHECK_CYCLE_MS, thisHour, sysDate.toString(), stockholmTime.toString());
}


function createPlayer(name) {
  var id = uuid.v4();
  var loopId;
  var player;
  var nameTaken = false;

  if (!name) { return null; }
  if (Object.keys(playerCrowd) > MAX_CROWD_SIZE) { return null; }

  if (playerCrowd[id]) {
    throw new Error('Player already exists');
  }

  for (loopId in playerCrowd) {
    if (playerCrowd.hasOwnProperty(loopId)) {
      player = playerCrowd[loopId];
      if (name.toLowerCase() === player.name.toLowerCase()) {
        nameTaken = true;
        break;
      }
    }
  }

  if (nameTaken) {
    return null;
  } else {
    playerCrowd[id] = new Player(name);
    return id;
  }
}

function removePlayer(id) {
  if (playerCrowd.hasOwnProperty(id)){
    delete playerCrowd[id];
  }
}

function getPlayer(id) {
  return playerCrowd[id] || null;
}

function getCrowdStats() {
  var topPlayers = [];
  var numBingos = 0;
  var player = {};
  for (var id in playerCrowd) {
    player = getPlayer(id);

    if (player.field.numBingos === 0) { continue; }

    topPlayers.push({
      name: player.name,
      numBingos: player.field.numBingos,
    });

    topPlayers.sort((a, b) => {
      if (a.numBingos > b.numBingos) {
        return -1;
      }

      if (b.numBingos > a.numBingos) {
        return 1;
      }

      if (a.numBingos === b.numBingos) {
        return 0;
      }
    });

    if (topPlayers.length > 3) {
      topPlayers = topPlayers.slice(0,3);
    }
  }

  return topPlayers;
}

function getTheWholeCrowd() {
  var crowd = [];
  var player = null;

  for (var id in playerCrowd) {
    player = getPlayer(id);

    crowd.push({
      name: player.name,
      numSelected: player.field.getNumberOfSelectedTiles(),
      numBingos: player.field.getNumberOfBingos(),
    });
  }

  crowd = crowd.slice(0, MAX_CROWD_SIZE);

  return crowd;
}

module.exports = {
  createPlayer,
  getPlayer,
  getCrowdStats,
  getTheWholeCrowd,
  startPlayerCrowdExpiration,
  removePlayer,
};
