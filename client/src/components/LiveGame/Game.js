const createBoard = (size) => {
  const board = [];
  for (let i = 0; i < size; i += 1) {
    board[i] = [];
    for (let j = 0; j < size; j += 1) {
      board[i][j] = [];
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
  }
}

export default Game;
