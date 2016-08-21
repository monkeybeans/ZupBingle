var Field = require('./Field');

module.exports = class Player {
  constructor(name) {
    if (!name) {
      throw new Error('Player needs a name');
    }

    this.name = name;
    this.field = new Field();
  }
}
