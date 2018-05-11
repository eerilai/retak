import { pieceCount, convertCoord } from './gameUtil';
import Stack from './Stack';

class Game {
  constructor(size, player1 = 'p1', player2 = 'p2') {
    this.toPlay = 1; // TODO: keep track of active player?
    this.first = player1;
    this.second = player2;
    this.size = size;
    this.board = [];
    this.squares = {};
    this.createBoard(size);
    this.pieces = {
      1: { ...pieceCount[size] }, // Props ['F'], ['C'], ['Total']
      2: { ...pieceCount[size] },
    };
    this.toMove = {
      stack: [],
      stone: '',
    };
    this.isMoving = false;
    this.moveOrigin = {};
    this.step = {};
    this.moveDir = '';
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
    Object.values(this.squares)
      .forEach(square => square.setNeighbors());
  }

  setMoveDir(stack) {
    if (stack.col > this.moveOrigin.col &&
        stack.row === this.moveOrigin.row) {
      this.moveDir = '>';
    } else if (stack.col < this.moveOrigin.col &&
               stack.row === this.moveOrigin.row) {
      this.moveDir = '<';
    } else if (stack.col === this.moveOrigin.col &&
               stack.row < this.moveOrigin.row) {
      this.moveDir = '+';
    } else if (stack.col === this.moveOrigin.col &&
               stack.row > this.moveOrigin.row) {
      this.moveDir = '-';
    }
  }

  selectStack(col, row, stone = '') {
    const coord = convertCoord([col, row]);
    const stack = this.squares[coord];
    const { isEmpty } = stack;

    if (!this.isMoving) {
      // Place a Stone
      if (isEmpty) {
        if (this.pieces[this.toPlay].F !== 0) {
          stack.place(this.toPlay, stone);
          if (stone === 'C') {
            this.pieces[this.toPlay].C -= 1;
            this.setState({ stone: '' });
          } else {
            this.pieces[this.toPlay].F -= 1;
            if (stone === 'S') this.setState({ stone: '' });
          }
          this.toPlay = (this.toPlay === 1) ? 2 : 1;
        }
      // Start a move
      } else if (!isEmpty && (stack.owner === this.toPlay)) {
        this.moveStack = [...stack.stack];
        this.toMove.stack = stack.stack.splice(0, this.size);
        this.toMove.stone = stack.stone;
        this.toMove.coord = coord;
        stack.stone = '';
        stack.owner = stack.stack[0] || 0;
        stack.isEmpty = !stack.stack.length;
        this.isMoving = true;
        this.moveOrigin = this.squares[coord];
        this.moveOrigin.validMove = true;
        Object.keys(stack.neighbors)
          .forEach((dir) => {
            if (stack.neighbors[dir].stone === '') {
              stack.neighbors[dir].validMove = true;
            } else if (stack.neighbors[dir].stone === 'S' &&
                       this.toMove.stone === 'C' &&
                       this.toMove.stack.length === 1) {
              stack.neighbors[dir].validMove = true;
            }
          });
      }
    // Continue Movement
    } else if (this.isMoving &&
               stack.stone === '' &&
               stack.validMove === true) {
      this.setMoveDir(stack);
      this.toMove.coord = coord;
      if (this.moveDir !== '') {
        this.moveOrigin.validMove = false;
        Object.keys(this.moveOrigin.neighbors)
          .forEach((dir) => { this.moveOrigin.neighbors[dir].validMove = false; });
        if (Object.prototype.hasOwnProperty.call(stack.neighbors, this.moveDir)) {
          if (stack.neighbors[this.moveDir].stone === '') {
            stack.neighbors[this.moveDir].validMove = true;
          } else if (stack.neighbors[this.moveDir].stone === 'S' &&
                     this.toMove.stone === 'C' &&
                     this.toMove.stack.length === 2) {
            stack.neighbors[this.moveDir].validMove = true;
          }
        }
        stack.validMove = true;
        this.step = stack;
      }
      stack.place(this.toMove.stack.pop());
      if (this.toMove.stack.length === 1 && this.toMove.stone === 'C') {
        Object.keys(this.moveOrigin.neighbors)
          .forEach((dir) => {
            if (stack.neighbors[dir].stone === 'S') {
              stack.neighbors[dir].validMove = true;
            }
          });
      }
      if (!this.toMove.stack.length) {
        stack.stone = this.toMove.stone;
        this.toMove = {};
        this.isMoving = false;
        this.moveOrigin.validMove = false;
        Object.keys(this.squares)
          .forEach((c) => { this.squares[c].validMove = false; });
        if (this.moveDir !== '') {
          this.toPlay = (this.toPlay === 1) ? 2 : 1;
        }
        this.moveDir = '';
      }
    // Wallsmash
    } else if (this.isMoving &&
               stack.stone === 'S' &&
               this.toMove.stone === 'C' &&
               this.toMove.stack.length === 1) {
      stack.place(this.toMove.stack.pop(), 'C');
      this.toMove.coord = '';
      Object.keys(this.squares)
        .forEach((c) => { this.squares[c].validMove = false; });
      this.isMoving = false;
      this.toPlay = (this.toPlay === 1) ? 2 : 1;
    }
  }
}

export default Game;
