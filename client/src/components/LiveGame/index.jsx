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
  }

  render() {
    return (
      <div className="home game">
        <div className="board">
          <Board game={this.state.game} />
        </div>
      </div>
    );
  }
}

export default LiveGame;
