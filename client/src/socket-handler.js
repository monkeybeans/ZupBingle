'use strict';
import Bingle from './bingle';
import { notifyPlayerBingo } from './notifications';

class SocketHandler {
  constructor() {
    if (!SocketHandler.initialized) {
      const bingle = new Bingle();
      const socket = io();

      socket.on('player_selected_tile', function(status) {
        bingle.updateLuckyCrowdStats();
        bingle.updateTheCrowd();

        if (status.new_bingo && !status.name.match(window.buzbingle_name)) {
          notifyPlayerBingo(status.name, status.num_bingos);
        }
      });

      socket.on('player_joined', function() {
        bingle.updateLuckyCrowdStats();
        bingle.updateTheCrowd();
      });

      socket.on('player_left', function() {
        bingle.updateLuckyCrowdStats();
        bingle.updateTheCrowd();
      });

      SocketHandler.initialized = true;
    }
  }
}

SocketHandler.initialized = false;

export default SocketHandler;
