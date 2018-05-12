import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

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
      stone: '',
    };
    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
    
    const { socket, username } = props;
    const { game } = this.state;
    socket.emit('syncGame', username); // Creates new room if not already in one
    socket.on('playerJoin', (player1, player2) => {
      game.player1 = player1;
      game.player2 = player2;
      game.activePlayer = player1;
    });
    socket.on('updateGame', ({ col, row, stone }) => {
      this.movePieces(col, row, false, stone);
    });
  }

  movePieces(col, row, isPlayerMove, stone = this.state.stone) {
    const { game } = this.state;
    game.selectStack(col, row, stone);
    if (this.state.stone !== '') {
      this.setState({
        stone: '',
      });
    }
    this.setState({
      game,
    });

    if (isPlayerMove) {
      this.props.socket.emit('broadcastGameUpdate', { col, row, stone, game: game.player1 });
    }
  }

  handleSquareClick(col, row) {
    if (this.props.username === this.state.game.activePlayer) {
      this.movePieces(col, row, true);
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

  winner() {
    if (this.state.game.victor !== 0) {
      return <h3>Player {this.state.game.victor} wins!</h3>;
    }
  }

  render() {
    const { game, stone } = this.state;
    return (
      <div className="main">
        <div className="home game">
          <div className="board">
            <div className="stone-count">
              Black | F({game.pieces[2].F}) / C({game.pieces[2].C})
            </div>
            <div>
              { this.winner() }
            </div>
            <Board game={game} handleSquareClick={this.handleSquareClick} />
            <div className="stone-select">
              <div className="active-stone">{stone}</div>
              <button className="piece" onClick={() => { this.toggleStanding(); }}>
                { stone === 'S' ? 'F' : 'S' }({ game.pieces[1].F })
              </button>
              <button className="piece" onClick={() => { this.selectCapstone('C'); }}>
              C ({game.pieces[1].C})
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.currentUser
  };
}

export default connect(mapStateToProps)(LiveGame);
