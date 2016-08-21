var randomTiles = require('./random-tiles');
var Tile = require('./Tile');

class Field {
  constructor() {
    this.rows = this.makeRows();
    this.numBingos = 0;
    this.newBingo = false;
  }

  makeRows() {
    //rows = [row][col]
    var tiles = randomTiles(Field.ROWS * Field.ROWS);
    var cols = [];
    var rows = [];
    for (var row = 0; row < Field.ROWS; row++) {
      for (var col = 0; col < Field.ROWS; col++) {
        cols[col] = new Tile(tiles.pop());
      }
      rows.push(cols);
      cols = [];
    }

    return rows;
  }

  selectTile(row, col) {
    var selected = false;
    var tile;
    var currentNumBingos = this.numBingos;
    if (row < Field.ROWS && col < Field.ROWS) {
      tile = this.rows[row][col];
      tile.selected = !tile.selected;
      selected = tile.selected;
    } else {
      console.log('Strange input for selectTile: ', row, col);
    }

    this.numBingos = this.getNumberOfBingos();

    if (this.numBingos > currentNumBingos){
      this.newBingo = true;
    } else {
      this.newBingo = false;
    }

    return selected;
  }

  getNumberOfSelectedTiles() {
    var numberSelected = 0;

    for (var row of this.rows) {
      row.forEach(tile => {
        tile.selected ? numberSelected++ : numberSelected;
      });
    }

    return numberSelected;
  }

  getNumberOfBingos() {
    var bingoHorizontal = 0;
    var bingoVertical = 0;
    var bingoDiagonalTop = 0;
    var bingoDiagonalBottom = 0;

    var totalBingos = 0;

    for (var row = 0; row < this.rows.length; row++) {
      for (var col = 0; col < this.rows[row].length; col++) {
        var tileSelected = this.rows[row][col].selected;
        var tileInverseSelected = this.rows[col][row].selected;
        if (tileSelected) {
          bingoHorizontal++;
        }

        if (tileInverseSelected) {
          bingoVertical++;
        }

        if (row === col && tileSelected) {
          bingoDiagonalTop++;
        }

        if (row + col === Field.ROWS - 1 && tileSelected) {
          bingoDiagonalBottom++;
        }
      }

      if (bingoHorizontal === Field.ROWS) {
        totalBingos++;
      }

      if (bingoVertical === Field.ROWS) {
        totalBingos++;
      }

      bingoHorizontal = 0;
      bingoVertical = 0;
    }

    if (bingoDiagonalTop === Field.ROWS) {
      totalBingos++;
    }

    if (bingoDiagonalBottom === Field.ROWS) {
      totalBingos++;
    }

    return totalBingos;
  }
}

Field.ROWS = 3;

module.exports = Field;
