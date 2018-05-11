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
    const coord = convertCoord([col, row]);
    const stack = game.squares[coord];
    const { isEmpty } = stack;
    if (!game.isMoving) {
      // Place a Stone
      if (isEmpty) {
        if (game.pieces[game.toPlay].F !== 0) {
          stack.place(game.toPlay, stone);
          if (stone === 'C') {
            game.pieces[game.toPlay].C -= 1;
            this.setState({ stone: '' });
          } else {
            game.pieces[game.toPlay].F -= 1;
            if (stone === 'S') this.setState({ stone: '' });
          }
          game.toPlay = (game.toPlay === 1) ? 2 : 1;
        }
      // Start a move
      } else if (!isEmpty && (stack.owner === game.toPlay)) {
        game.moveStack = [...stack.stack];
        game.toMove.stack = stack.stack.splice(0, game.size);
        game.toMove.stone = stack.stone;
        game.toMove.coord = coord;
        stack.stone = '';
        stack.owner = stack.stack[0] || 0;
        stack.isEmpty = !stack.stack.length;
        game.isMoving = true;
        game.moveOrigin = game.squares[coord];
        game.moveOrigin.validMove = true;
        Object.keys(stack.neighbors)
          .forEach((dir) => {
            if (stack.neighbors[dir].stone === '') {
              stack.neighbors[dir].validMove = true;
            } else if (stack.neighbors[dir].stone === 'S' &&
                       game.toMove.stone === 'C' &&
                       game.toMove.stack.length === 1) {
              stack.neighbors[dir].validMove = true;
            }
          });
      }
    // Continue Movement
    } else if (game.isMoving &&
               stack.stone === '' &&
               stack.validMove === true) {
      game.setMoveDir(stack);
      game.toMove.coord = coord;
      if (game.moveDir !== '') {
        game.moveOrigin.validMove = false;
        Object.keys(game.moveOrigin.neighbors)
          .forEach((dir) => { game.moveOrigin.neighbors[dir].validMove = false; });
        if (Object.prototype.hasOwnProperty.call(stack.neighbors, game.moveDir)) {
          if (stack.neighbors[game.moveDir].stone === '') {
            stack.neighbors[game.moveDir].validMove = true;
          } else if (stack.neighbors[game.moveDir].stone === 'S' &&
                     game.toMove.stone === 'C' &&
                     game.toMove.stack.length === 2) {
            stack.neighbors[game.moveDir].validMove = true;
          }
        }
        stack.validMove = true;
        game.step = stack;
      }
      stack.place(game.toMove.stack.pop());
      if (game.toMove.stack.length === 1 && game.toMove.stone === 'C') {
        Object.keys(game.moveOrigin.neighbors)
          .forEach((dir) => {
            if (stack.neighbors[dir].stone === 'S') {
              stack.neighbors[dir].validMove = true;
            }
          });
      }
      if (!game.toMove.stack.length) {
        stack.stone = game.toMove.stone;
        game.toMove = {};
        game.isMoving = false;
        game.moveOrigin.validMove = false;
        Object.keys(game.squares)
          .forEach((c) => { game.squares[c].validMove = false; });
        if (game.moveDir !== '') {
          game.toPlay = (game.toPlay === 1) ? 2 : 1;
        }
        game.moveDir = '';
      }
    // Wallsmash
    } else if (game.isMoving &&
               stack.stone === 'S' &&
               game.toMove.stone === 'C' &&
               game.toMove.stack.length === 1) {
      stack.place(game.toMove.stack.pop(), 'C');
      Object.keys(game.squares)
        .forEach((c) => { game.squares[c].validMove = false; });
      game.isMoving = false;
      game.toPlay = (game.toPlay === 1) ? 2 : 1;
    }

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
