import React, { Component } from 'react';
import axios from 'axios';
import Game from './Game';
import Board from './Board';
import Stack from './Stack';
import Chat from './chat'; // not in use currently
import '../../styles/livegame.css';
import { convertCoord } from './gameUtil';

class LiveGame extends Component {
  constructor(props) {
    super(props);
    const newGame = new Game(5);
    this.state = {
      game: newGame,
      username: '',
      stone: '',
    };
    this.selectSquare = this.selectSquare.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
    
    const { socket } = props;
    socket.emit('createGame'); // Only creates if not already in game
    socket.on('updateGame', ({ col, row, stone }) => {
      this.selectSquare(col, row, false, stone);
    });
  }

  selectSquare(col, row, isPlayerMove, stone = this.state.stone) {
    const { game } = this.state;
    game.selectStack(col, row, stone);

    this.setState({
      game,
    });

    // Update game for other player if your move
    if (isPlayerMove) {
      this.props.socket.emit('broadcastGameUpdate', { col, row, stone });
    }
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
      <div className="main">
        <div className="home game">
          <div className="board">
            <div className="stone-count">
              Black | F({this.state.game.pieces[2].F}) / C({this.state.game.pieces[2].C})
            </div>
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
      </div>
    );
  }
}

export default LiveGame;
