import { convertCoord } from './gameUtil';

class Stack {
  constructor(game, col, row) {
    this.col = col;
    this.row = row;
    this.loc = [col, row];
    this.coord = convertCoord(this.loc);
    this.stone = '';
    this.owner = 0;
    this.stack = [];
    this.isEmpty = true;
    this.neighbors = {};
    this.edges = [];
    this.isEW = false;
    this.isNS = false;
    this.validMove = false;
  }

  place(player, stone = '') {
    this.stack.unshift(player);
    this.stone = stone;
    this.owner = player;
    this.isEmpty = false;
  }
}

export default Stack;
