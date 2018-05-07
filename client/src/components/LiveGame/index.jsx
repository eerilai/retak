import React, { Component } from 'react';
import Game from './Game';
import Board from './Board';

class LiveGame extends Component {
  constructor(props) {
    super(props);
    const newGame = new Game(5);
    this.state = {
      game: newGame,
    };
    this.select = this.select.bind(this);
  }

  select(col, row) {
    const newBoard = this.state.game;
    newBoard.board[col][row].push(1);
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
