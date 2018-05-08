import { pieceCount } from './gameUtil';
import Stack from './Stack';

const createBoard = (size) => {
  const board = [];
  for (let i = 0; i < size; i += 1) {
    board[i] = [];
    for (let j = 0; j < size; j += 1) {
      board[i][j] = new Stack();
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
