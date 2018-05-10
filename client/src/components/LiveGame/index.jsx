import React, { Component } from 'react';
import Game from './Game';
import Board from './Board';
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
    this.selectSquare = this.selectSquare.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
  }

  selectSquare(col, row) {
    const { game } = this.state;
    const coord = convertCoord([col, row]);
    const stack = game.squares[coord];
    const { isEmpty } = stack;
    if (!game.isMoving && !game.canMove) {
      if (isEmpty) {
        if (game.pieces[game.toPlay].F !== 0) {
          stack.place(game.toPlay, this.state.stone);
          if (this.state.stone === 'C') {
            game.pieces[game.toPlay].C -= 1;
            this.setState({ stone: '' });
          } else {
            game.pieces[game.toPlay].F -= 1;
            if (this.state.stone === 'S') this.setState({ stone: '' });
          }
          game.toPlay = (game.toPlay === 1) ? 2 : 1;
        }
      } else if (!isEmpty && (stack.owner === game.toPlay)) {
        game.moveStack = [...stack.stack];
        game.toMove.stack = stack.stack.splice(0, game.size);
        game.toMove.stone = stack.stone;
        stack.stone = '';
        stack.owner = stack.stack[0] || 0;
        stack.isEmpty = !stack.stack.length;
        game.isMoving = true;
        game.moveOrigin = game.squares[coord];
        game.moveOrigin.validMove = true;
        console.log(game.moveOrigin);
        Object.values(stack.neighbors)
          .forEach((s) => { if (s.stone === '') s.validMove = true; });
      }
    } else if (game.isMoving &&
               stack.stone === '' &&
               stack.validMove === true) {
      game.setMoveDir(stack);
      stack.place(game.toMove.stack.pop());
      if (!game.toMove.stack.length) {
        game.moveDir = '';
        stack.stone = game.toMove.stone;
        game.toMove = {};
        game.isMoving = false;
        game.moveOrigin.validMove = false;
        Object.values(game.moveOrigin.neighbors)
          .forEach((s) => { s.validMove = false; });
        if (JSON.stringify(game.moveOrigin.stack) !== JSON.stringify(game.moveStack)) {
          game.toPlay = (game.toPlay === 1) ? 2 : 1;
        }
      }
    } else if (stack.stone === 'S' &&
               game.toMove.stone === 'C' &&
               game.toMove.stack.length === 1) {
      stack.place(game.toMove.stack.pop(), 'C');
      game.isMoving = false;
      game.toPlay = (game.toPlay === 1) ? 2 : 1;
    }

    this.setState({
      game,
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
