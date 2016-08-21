'use strict';

export function notifyPlayerBingo(name, numBingos) {
  var root = document.getElementById('shout-box');
  var notifier = document.createElement('div');
  var content = document.createElement('span');
  var text = document.createTextNode('*' + name + '* has now *' + numBingos + '* bingos!!');
  notifier.classList.add('bingo-notifier');

  content.appendChild(text);
  notifier.appendChild(content);
  root.insertBefore(notifier, root.firstChild);

  //cleanup
  setTimeout(() => {
    root.removeChild(notifier);
  }, 30 * 1000);
}
