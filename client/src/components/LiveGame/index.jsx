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
    };
    this.toMove = [];
    this.isMoving = false;
    this.select = this.select.bind(this);
  }

  select(col, row) {
    const newBoard = this.state.game;
    const stack = newBoard.board[col][row];
    const { isOccupied } = stack;
    if (!this.isMoving) {
      if (!isOccupied) {
        if (newBoard.toPlay === 1) {
          newBoard.board[col][row] = new Stack(1);
          newBoard.toPlay = 2;
        } else if (newBoard.toPlay === 2) {
          newBoard.board[col][row] = new Stack(2);
          newBoard.toPlay = 1;
        }
      } else if (isOccupied && (stack.owner === newBoard.toPlay)) {
        this.toMove = stack.stack;
        newBoard.board[col][row] = new Stack();
        this.isMoving = true;
      }
    } else {
      stack.stack.push(this.toMove.shift());
      if (!this.toMove.length) {
        this.isMoving = false;
        newBoard.toPlay = (newBoard.toPlay === 1) ? 2 : 1;
      }
    }

    this.setState({
      game: newBoard,
    });
  }

  render() {
    return (
      <div className="home game">
        <div className="board">
          <Board game={this.state.game} select={this.select} />
        </div>
      </div>
    );
  }
}

export default LiveGame;
