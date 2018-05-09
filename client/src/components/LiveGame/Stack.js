import { convertCoord } from './gameUtil';

class Stack {
  constructor(game, col, row) {
    this.game = game;
    this.loc = [col, row];
    this.coord = convertCoord(this.loc);
    this.stone = '';
    this.owner = 0;
    this.stack = [];
    this.isOccupied = false;
    this.neighbors = {};
  }

  place(player, stone = '') {
    this.stack.unshift(player);
    this.stone = stone;
    this.owner = player;
    this.isOccupied = true;
  }
}

export default Stack;
