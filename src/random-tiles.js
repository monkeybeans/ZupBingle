var randomTiles = [
  "Someone important says right",
  "Someone mentions encuraging",
  "Someone mentions transparent",
  "Someones says as a true nordneter",
  "Someone is so moved hir starts to cry",
  "Two guys start to wrestle funny",
  "Customer satisfaction is said",
  "Someone gets lost at the table change",
  "Someone mentions be in the drivers position",
  "Someone says cash flow",
  "Someone says return on equity",
  "Someone says smart",
  "Someone says honest",
  "Someone says committed",
  "Someone is curious",
  "We want to change the game is said",
  "Empowering is mentioned",
  "A story of a journy is told",
  "A fancy graph is presented",
  "Cheers is screamed loudly",
  "You hear cost reduction",
  "You hear endorsement",
  "Some unknown acronym is mentioned",
];

function getRandomTiles(quantity) {
  var selection = [];
  var numSelected = 1;
  var rnd = 0;
  var rndTile = '';

  if (!parseInt(quantity, 10) || randomTiles.length < quantity) {
    throw new Error('Need to be an int max size: ' + randomTiles.length);
  }

  while(numSelected <= quantity) {
    rnd = Math.floor(Math.random() * randomTiles.length);
    rndTile = randomTiles[rnd];

    if (selection.indexOf(rndTile) === -1) {
      selection.push(rndTile);
      ++numSelected;
    }
  }

  return selection;
}


module.exports = getRandomTiles;
