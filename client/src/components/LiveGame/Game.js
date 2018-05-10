import { pieceCount } from './gameUtil';
import Stack from './Stack';

class Game {
  constructor(size, player1 = 'p1', player2 = 'p2') {
    this.first = player1;
    this.second = player2;
    this.size = size;
    this.board = [];
    this.squares = {};
    this.createBoard(size);
    this.toPlay = 1;
    this.pieces = {
      1: { ...pieceCount[size] }, // Props ['F'], ['C'], ['Total']
      2: { ...pieceCount[size] },
    };
  }

  createBoard(size) {
    for (let row = 0; row < size; row += 1) {
      this.board[row] = [];
      for (let col = 0; col < size; col += 1) {
        const stack = new Stack(this, row, col);
        this.board[row][col] = stack;
        this.squares[stack.coord] = stack;
      }
    }
  }
}

export default Game;
