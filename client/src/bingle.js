'use strict';

import RegisterName from './register-name';
import { doPost, doGet } from './requests';

class Bingle {
  constructor() {
    if (!Bingle.initialized) {
      console.log('initialized bingle...');
      const register = new RegisterName();

      document.getElementById('leave-game').addEventListener('click', this.leaveGame.bind(this));
      document.getElementById('leave-game').addEventListener('touch', this.leaveGame.bind(this));

      [].forEach.call(document.getElementsByClassName('bingo-tile'), tile => {
        tile.addEventListener('click', this.selectTile.bind(this, tile), false);
        tile.addEventListener('touch', this.selectTile.bind(this, tile), false);
      });


      register.checkSession();

      this.randomiseBingoTileColors();
      this.updatePlayerStats();
      this.updateLuckyCrowdStats();
      this.updateTheCrowd();

      Bingle.initialized = true;
    }
  }

  selectTile(tileElem, event) {
    const toggleSelect = select => {
      if (select) {
        tileElem.classList.add('bingo-tile--selected');
      } else {
        tileElem.classList.remove('bingo-tile--selected');
      }
    };

    const coordinates = tileElem.getAttribute('data-coordinates').split('-');
    const selected = tileElem.classList.contains('bingo-tile--selected');

    toggleSelect(!selected);

    doPost('/api/player/select-tile', { row: coordinates[1], col: coordinates[0]})
    .then(tile => {
      toggleSelect(tile.selected);

      this.updatePlayerStats();
    })
    .catch( e => {
      console.log('No update of tile:', e);
      toggleSelect(selected);
    });
  }

  updateLuckyCrowdStats() {
    var statElem = document.getElementById('pole-position');
    doGet('/api/crowd/stats')
    .then( stats => {
      statElem.innerHTML = stats.map((stat, index) => {
        var present = (index + 1) + '. ' + stat.name + ' ';
        present = present.replace(/\s+/g, '&nbsp;');
        return present;
      }).join(' ');
    })
    .catch( e => console.log('Could not get players data: ', e));
  }

  updateTheCrowd() {
    var statElem = document.getElementById('buzzing-crowd');
    var numberToSymbol = (number) => {
      var symbol = number;
      if (parseInt(number) !== NaN) {
        symbol = number === 0 ? '&#45;' : Array(number + 1).join('&#8226;');
        symbol = symbol.replace(/((&#8226;){2})/g, '$1 ').replace(/\s$/, '');
      }

      return symbol;
    };

    doGet('/api/crowd/all')
    .then( crowd => {
      statElem.innerHTML = crowd.map(player =>
        player.name + '&thinsp;' +'[' + player.numSelected + '&thinsp;' + numberToSymbol(player.numBingos) + ']'
      ).join(' vs ') || '&nbsp;';
    })
    .catch( e => console.log('Could not get the crowd: ', e));
  }

  updatePlayerStats() {
    var statElem = document.getElementById('current-player');
    doGet('/api/player/stats')
    .then( stats => {
      statElem.innerHTML = 'You are currently known as ' + stats.name + '.'; // Selected: ' + stats.numSelected + ' Bingo: ' + stats.numBingos;
      window.buzbingle_name = stats.name; // @TODO: not very nice...do something about it
    })
    .catch( e => console.log('Could not get data: ', e));
  }

  randomiseBingoTileColors() {
    var bingoTiles = [].slice.call(document.getElementsByClassName('bingo-tile'), 0);
    var classes = ['rnd-clr-1','rnd-clr-2','rnd-clr-3','rnd-clr-4','rnd-clr-5','rnd-clr-6',];

    bingoTiles.forEach(tile => {
      var rndIndx = Math.floor(Math.random() * classes.length);
      tile.classList.add(classes[rndIndx]);
    });

  }

  leaveGame() {
    doPost('/api/player/remove')
    .then(() => {
      document.location.reload(true);
    })
    .catch( e => console.log('Could not remove player: ', e));
  }
}
Bingle.initialized = false;

export default Bingle;
