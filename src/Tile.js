class Tile {
  constructor(name) {
    this.name = name;
    this.selected = false;
  }

  select(keep) {
    this.selected = !!(keep);
  }
}

module.exports = Tile;
