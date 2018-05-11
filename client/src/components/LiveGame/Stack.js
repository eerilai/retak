import { convertCoord } from './gameUtil';

class Stack {
  constructor(game, col, row) {
    this.game = game;
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

  setNeighbors() {
    if (this.col === 0) {
      this.edges.push('<');
      this.isEW = true;
    } else if (this.col === this.game.size - 1) {
      this.edges.push('>');
      this.isEW = true;
    }
    if (this.row === 0) {
      this.edges.push('-');
      this.isNS = true;
    } else if (this.row === this.game.size - 1) {
      this.edges.push('+');
      this.isNS = true;
    }

    if (this.row !== 0) {
      this.neighbors['-'] =
        this.game.squares[convertCoord([this.col, this.row - 1])];
    }
    if (this.row !== this.game.size - 1) {
      this.neighbors['+'] =
        this.game.squares[convertCoord([this.col, this.row + 1])];
    }
    if (this.col !== 0) {
      this.neighbors['<'] =
        this.game.squares[convertCoord([this.col - 1, this.row])];
    }
    if (this.col !== this.game.size - 1) {
      this.neighbors['>'] =
        this.game.squares[convertCoord([this.col + 1, this.row])];
    }
  }
}

export default Stack;
