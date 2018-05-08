import { pieceCount } from './gameUtil';
import Stack from './Stack';

const createBoard = (size) => {
  const board = [];
  for (let row = 0; row < size; row += 1) {
    board[row] = [];
    for (let col = 0; col < size; col += 1) {
      board[row][col] = new Stack(this, row, col);
    }
  }
  return board;
};

class Game {
  constructor(size, player1 = 'p1', player2 = 'p2') {
    this.size = size;
    this.first = player1;
    this.second = player2;
    this.board = createBoard(size);
    this.toPlay = 1;
    this.pieces = {
      1: { ...pieceCount[size] }, // Props ['F'], ['C'], ['Total']
      2: { ...pieceCount[size] },
    };
  }
}

export default Game;
