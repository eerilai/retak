import axios from 'axios';
import { pieceCount, convertCoord } from './gameUtil';
import Stack from './Stack';

class Game {
  constructor(size, gameState = 'new', player1 = null, player2 = null, ranked = false) {
    this.toPlay = 1;
    this.activePlayer = null;
    this.player1 = player1;
    this.player2 = player2;
    this.victor = 0; // 0, 1, or 2
    this.winType = null; // null, R, F, 1 or 1/2
    this.winString = '';
    this.ranked = ranked;
    this.size = size;
    this.timeControl = '';
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
    this.step = '';
    this.lastStep = '';
    this.moveDir = '';

    this.turn = 0;
    this.ptn = [];
    this.ptnString = '';
    this.plyPtn = [];
    this.tps = '';

    this.isBoardFull = false;
    this.p1FlatScore = 0;
    this.p2FlatScore = 0;
    this.victorUsername = null; // Wining Player Username or null
    this.loserUsername = null; // Loosing Player Username or null

    if (gameState !== 'new') {
      const { tps, ptn } = gameState;
      this.tps = tps;
      this.ptn = ptn;
      this.readTPS(tps);
    }
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

  parsePTN(coord, stone) {
    if (!this.isMoving && this.toPlay === 1) {
      this.ptn.push([`${stone}${coord}`]);
    } else if (!this.isMoving) {
      this.ptn[this.turn].push(`${stone}${coord}`);
    } else if (this.plyPtn.length === 0 && this.moveDir) {
      this.plyPtn.push(this.toMove.stack.length + 1);
      this.plyPtn.push(`${this.moveOrigin.coord}${this.moveDir}`);
      this.plyPtn.push(1);
      this.lastStep = this.step;
    } else if (this.plyPtn.length && this.lastStep === this.step) {
      this.plyPtn[this.plyPtn.length - 1] += 1;
    } else if (this.plyPtn.length) {
      this.plyPtn.push(1);
      this.lastStep = this.step;
    }
    if (this.isMoving && this.toMove.stack.length === 0) {
      if (this.plyPtn[0] === 1) {
        this.plyPtn.shift();
      }
      if (((this.plyPtn.length === 3 || this.plyPtn.length === 2) &&
          this.plyPtn[this.plyPtn.length - 1] === 1) ||
          this.plyPtn[0] === this.plyPtn[2]) {
        this.plyPtn.pop();
      }
      if (this.plyPtn.length) {
        if (this.toPlay === 1) {
          this.ptn.push([this.plyPtn.join('')]);
        } else {
          this.ptn[this.turn].push(this.plyPtn.join(''));
        }
        this.plyPtn = [];
      }
    }
    if (this.winType !== null) {
      this.ptn.push([this.winString]);
      this.handleWin();
    }
  }

  parseTPS(board) {
    const tpsArray = [];
    for (let row = this.size - 1; row >= 0; row -= 1) {
      const tpsRow = [];
      for (let col = 0; col < this.size; col += 1) {
        const stack = board[col][row];
        if (!stack.isEmpty) {
          const rstack = [...stack.stack].reverse();
          tpsRow.push([...rstack, stack.stone].join(''));
        } else {
          tpsRow.push('x');
        }
      }
      tpsArray.push(tpsRow.join(','));
    }
    let tps = tpsArray.join('/');
    this.tps = `[TPS "${tps} ${this.toPlay} ${this.turn + 1}"]`;
  }

  readTPS(tps) {
    let parsedTPS = tps.split('').slice(6, tps.length - 2).join('').split(' ');
    this.turn = +parsedTPS.pop() - 1;
    this.toPlay = +parsedTPS.pop();
    parsedTPS = parsedTPS.join('').split('/');
    parsedTPS.forEach((row, i) => { parsedTPS[i] = row.split(',') });
    parsedTPS = parsedTPS.join(',').split(',');
    for (let row = this.size - 1; row >= 0; row -= 1) {
      for (let col = 0; col < this.size; col += 1) {
        const stack = this.board[col][row];
        let square = parsedTPS.shift();
        if (square !== 'x') {
          const stone = square[square.length - 1];
          if (stone === 'C' || stone === 'S') {
            stack.stone = square.split('').pop();
            square = square.slice(0, square.length - 1);
            if (stone === 'C') {
              this.pieces[square[square.length - 1]].C -= 1;
            }
          }
          let s = square.split('').reverse().map((x) => {
            if (+x === 1) {
              this.pieces[1].F -= 1;
              this.pieces[1].Total -= 1;
            } else if (+x === 2) {
              this.pieces[2].F -= 1;
              this.pieces[2].Total -= 1;
            }
            return +x;
          });
          stack.stack = s;
          stack.isEmpty = false;
          stack.owner = s[0];
        }
      }
    }
    this.checkRoads();
    this.checkFullBoardWins();
    if (this.pieces[1].total === 0 || this.pieces[2].total === 0) {
      this.checkOutOfPiecesWins();
    }
  }

  selectStack(col, row, stone = '') {
    const coord = convertCoord([col, row]);
    const stack = this.squares[coord];
    const { isEmpty } = stack;

    if (this.winType === null) {
      if (!this.isMoving) {
        // Place a Stone
        if (isEmpty) {
          if (this.turn === 0) {
            if (this.toPlay === 1) {
              stack.place(2);
              this.pieces[2].F -= 1;
              this.pieces[this.toPlay].total -= 1;
            } else {
              stack.place(1);
              this.pieces[1].F -= 1;
              this.pieces[this.toPlay].total -= 1;
            }
          } else if (this.pieces[this.toPlay].total !== 0) {
            if (stone === 'C' && this.pieces[this.toPlay].C !== 0) {
              stack.place(this.toPlay, stone);
              this.pieces[this.toPlay].C -= 1;
              this.pieces[this.toPlay].total -= 1;
            } else if (stone !== 'C' && this.pieces[this.toPlay].F !== 0) {
              stack.place(this.toPlay, stone);
              this.pieces[this.toPlay].F -= 1;
              this.pieces[this.toPlay].total -= 1;
            }
          }
          this.checkRoads();
          this.checkFullBoardWins();
          if (this.pieces[this.toPlay].total === 0) {
            this.checkOutOfPiecesWins();
          }
          this.parsePTN(coord, stone);
          this.toPlay = (this.toPlay === 1) ? 2 : 1;
          if (this.toPlay === 1) this.turn += 1;
          this.parseTPS(this.board);
          this.activePlayer = (this.activePlayer === this.player1) ? this.player2 : this.player1;

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
          this.step = stack.coord;
        }
        stack.place(this.toMove.stack.pop());
        this.parsePTN();
        if (this.toMove.stack.length === 1 && this.toMove.stone === 'C') {
          Object.keys(this.moveOrigin.neighbors)
            .forEach((dir) => {
              if (stack.neighbors[dir] && stack.neighbors[dir].stone === 'S') {
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
            this.checkFullBoardWins();
            this.toPlay = (this.toPlay === 1) ? 2 : 1;
            if (this.toPlay === 1) this.turn += 1;
            this.parseTPS(this.board);
            this.activePlayer = (this.activePlayer === this.player1) ? this.player2 : this.player1;
          }
          this.moveDir = '';
        }
      // Wallsmash
      } else if (this.isMoving &&
                 stack.stone === 'S' &&
                 this.toMove.stone === 'C' &&
                 this.toMove.stack.length === 1) {
        this.setMoveDir(stack);
        this.toMove.coord = coord;
        this.step = stack.coord;
        stack.place(this.toMove.stack.pop(), 'C');
        this.parsePTN();
        this.toMove.coord = '';
        Object.keys(this.squares)
          .forEach((c) => { this.squares[c].validMove = false; });
        this.isMoving = false;
        this.checkRoads();
        this.checkFullBoardWins();
        this.toPlay = (this.toPlay === 1) ? 2 : 1;
        if (this.toPlay === 1) this.turn += 1;
        this.parseTPS(this.board);
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
        this.victorUsername = (this.victor === 1) ? this.player1 : this.player2;
        this.loserUsername = (this.victor === 1) ? this.player2 : this.player1;
        this.winType = 'R';
        this.setWinString();
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

  checkFullBoardWins(){
    let isOccupiedCnt = 0;
    let p1FCnt = 0;
    let p2FCnt =0;
    
    Object.values(this.squares).forEach(square => {
      if(square.isEmpty === false){
        isOccupiedCnt++;
        if(square.owner === 1 && square.stone === ''){
          p1FCnt++;
        }
        if(square.owner === 2 && square.stone === ''){
          p2FCnt++;
        }
      } 
    })
    this.p1FlatScore = p1FCnt;
    this.p2FlatScore = p2FCnt;
    if( isOccupiedCnt === (this.size * this.size)){
      this.isBoardFull = true;
      if(this.p1FlatScore === this.p2FlatScore){
        this.victor = 0;
        this.winType = '1/2';
        this.setWinString();
      } else {
        this.victor = this.p1FlatScore > this.p2FlatScore ? 1 : 2;
        this.victorUsername = (this.victor === 1) ? this.player1 : this.player2;
        this.loserUsername = (this.victor === 1) ? this.player2 : this.player1;
        this.winType = 'F';
        this.setWinString();
      }
    }
    return;
  }

  checkOutOfPiecesWins(){
    if(this.p1FlatScore === this.p2FlatScore){
      this.victor = 0;
      this.winType = '1/2';
      this.setWinString();
    } else {
      this.victor = this.p1FlatScore > this.p2FlatScore ? 1 : 2;
      this.victorUsername = (this.victor === 1) ? this.player1 : this.player2;
      this.loserUsername = (this.victor === 1) ? this.player2 : this.player1;
      this.winType = 'F';
      this.setWinString();
    }
    return;
  }

  setWinString() {
    if (this.winType === '1/2') {
      this.winString = '1/2—1/2';
    } else if (this.winType === 'T') {
      this.winString = this.victor === 1 ? '1—0' : '0—1';
    } else {
      this.winString = this.victor === 1 ? `${this.winType}—0` : `0—${this.winType}`;
    }
  }

  printPTN() {
    this.ptn.forEach((turn, i) => {
      if (i !== this.ptn.length - 1) {
        this.ptnString += `${i + 1}. ${turn.join(' ')} `;
      } else {
        this.ptnString += turn;
      }
    });
  }

  handleWin() {
    this.printPTN();
    this.parseTPS(this.board);
  }

  timeOut(player) {
    this.victor = player === this.player1 ? 2 : 1;
    this.victorUsername = this.victor === 1 ? this.player1 : this.player2;
    this.loserUsername = this.victor === 1 ? this.player2 : this.player1;
    this.winType = 'T';
    this.setWinString();
  }
}

export default Game;
