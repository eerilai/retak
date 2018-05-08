import React, { Component } from 'react';
import Game from './Game';
import Board from './Board';
import Stack from './Stack';

class LiveGame extends Component {
  constructor(props) {
    super(props);
    const newGame = new Game(5);
    this.state = {
      game: newGame,
      stone: '',
    };
    this.toMove = [];
    this.isMoving = false;
    this.selectSquare = this.selectSquare.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
  }

  selectSquare(col, row) {
    const newBoard = this.state.game;
    const stack = newBoard.board[col][row];
    const { isOccupied } = stack;
    if (!this.isMoving) {
      if (!isOccupied) {
        newBoard.board[col][row].place(newBoard.toPlay, this.state.stone);
        if (this.state.stone === 'C') {
          newBoard.pieces[newBoard.toPlay].C -= 1;
          this.setState({ stone: '' });
        } else {
          newBoard.pieces[newBoard.toPlay].F -= 1;
          if (this.state.stone === 'S') this.setState({ stone: '' });
        }
        newBoard.toPlay = (newBoard.toPlay === 1) ? 2 : 1;
      } else if (isOccupied && (stack.owner === newBoard.toPlay)) {
        this.toMove = stack.stack;
        newBoard.board[col][row] = new Stack();
        this.isMoving = true;
      }
    } else {
      stack.place(this.toMove.shift());
      if (!this.toMove.length) {
        this.isMoving = false;
        newBoard.toPlay = (newBoard.toPlay === 1) ? 2 : 1;
      }
    }

    this.setState({
      game: newBoard,
    });
  }

  selectCapstone(stone) {
    if (this.state.game.pieces[this.state.game.toPlay].C > 0) {
      this.setState({
        stone,
      });
    }
  }

  toggleStanding() {
    if (this.state.stone === '') {
      this.setState({ stone: 'S' });
    } else {
      this.setState({ stone: '' });
    }
  }

  render() {
    return (
      <div className="home game">
        <div className="board">
          <Board game={this.state.game} selectSquare={this.selectSquare} />
          <div className="stone-select">
            <div className="active-stone">{this.state.stone}</div>
            <button className="piece" onClick={() => { this.toggleStanding(); }}>
              { this.state.stone === 'S' ? 'F' : 'S' }({ this.state.game.pieces[1].F })
            </button>
            <button className="piece" onClick={() => { this.selectCapstone('C'); }}>
            C ({this.state.game.pieces[1].C})
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LiveGame;
