import { pieceCount, convertCoord } from './gameUtil';
import Stack from './Stack';

class Game {
  constructor(size, player1 = 'p1', player2 = 'p2') {
    this.toPlay = 1;
    this.activePlayer = null;
    this.player1 = null;
    this.player2 = null;
    this.victor = 0; // 0, 1, or 2
    this.winType = ''; // R, F, or 1
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
    for (let row = this.size - 1; row >= 0; row -= 1) {
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
               stack.row > this.moveOrigin.row) {
      this.moveDir = '+';
    } else if (stack.col === this.moveOrigin.col &&
               stack.row < this.moveOrigin.row) {
      this.moveDir = '-';
    }
  }

  selectStack(col, row, stone = '') {
    const coord = convertCoord([col, row]);
    const stack = this.squares[coord];
    const { isEmpty } = stack;

    if (this.victor === 0) {
      if (!this.isMoving) {
        // Place a Stone
        if (isEmpty) {
          if (this.pieces[this.toPlay].F !== 0) {
            stack.place(this.toPlay, stone);
            if (stone === 'C') {
              this.pieces[this.toPlay].C -= 1;
            } else {
              this.pieces[this.toPlay].F -= 1;
            }
            this.checkRoads();
            this.toPlay = (this.toPlay === 1) ? 2 : 1;
            this.activePlayer = (this.activePlayer === this.player1) ? this.player2 : this.player1;
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
            this.checkRoads();
            this.toPlay = (this.toPlay === 1) ? 2 : 1;
            this.activePlayer = (this.activePlayer === this.player1) ? this.player2 : this.player1;            
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
        this.checkRoads();
        this.toPlay = (this.toPlay === 1) ? 2 : 1;
        this.activePlayer = (this.activePlayer === this.player1) ? this.player2 : this.player1;
      }
    }
  }

  checkRoads() {
    let checkNS = false;
    let checkEW = false;
    let player = 0;
    let checked = [];
    const followRoad = (square, p) => {
      if ((checkNS && square.edges.includes('+')) ||
          (checkEW && square.edges.includes('>'))) {
        this.victor = p;
        this.winType = 'R';
      } else {
        checked.push(square.coord);
        const up = square.neighbors['+'];
        const left = square.neighbors['<'];
        const right = square.neighbors['>'];
        const down = square.neighbors['-'];
        if (square.row < this.size - 1 && up.owner === p && up.stone !== 'S' && !checked.includes(up.coord)) {
          followRoad(up, p);
        }
        if (square.col > 0 && left.owner === p && left.stone !== 'S' && !checked.includes(left.coord)) {
          followRoad(left, p);
        }
        if (square.col < this.size - 1 && right.owner === p && right.stone !== 'S' && !checked.includes(right.coord)) {
          followRoad(right, p);
        }
        if (square.row > 0 && down.owner === p && down.stone !== 'S' && !checked.includes(down.coord)) {
          followRoad(down, p);
        }
      }
    };
    checkNS = true;
    for (let col = 0; col < this.size; col += 1) {
      player = this.board[col][0].owner;
      if (player !== 0 && this.board[col][1].owner === player && this.board[col][1].stone !== 'S') {
        checked.push(this.board[col][0].coord);
        followRoad(this.board[col][1], player);
      }
    }
    checked = [];
    checkNS = false;
    checkEW = true;
    for (let row = 0; row < this.size; row += 1) {
      player = this.board[0][row].owner;
      if (player !== 0 && this.board[1][row].owner === player && this.board[1][row].stone !== 'S') {
        checked.push(this.board[0][row].coord);
        followRoad(this.board[1][row], player);
      }
    }
  }
}

export default Game;
