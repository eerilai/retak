import React, { Component } from "react";
import axios from 'axios';

import Game from "./Game";
import Board from "./Board";
import Stack from "./Stack";
import Chat from "./chat";

class LiveGame extends Component {
  constructor(props) {
    super(props);
    const newGame = new Game(5);
    this.state = {
      game: newGame,
      stone: '',
    };
    this.toMove = {};
    this.isMoving = false;
    this.selectSquare = this.selectSquare.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
  }

  componentWillMount() {
    axios.post('/game/newGame')
      .then((res) => {
        const { username } = res.data;
        console.log('username: ' + username);
        this.setState({
          username
        });
      });
  }

  selectSquare(col, row) {
    const newBoard = this.state.game;
    const stack = newBoard.board[col][row];
    const { isOccupied } = stack;
    if (!this.isMoving) {
      if (!isOccupied) {
        if (newBoard.pieces[newBoard.toPlay].F !== 0) {
          newBoard.board[col][row].place(newBoard.toPlay, this.state.stone);
          if (this.state.stone === 'C') {
            newBoard.pieces[newBoard.toPlay].C -= 1;
            this.setState({ stone: '' });
          } else {
            newBoard.pieces[newBoard.toPlay].F -= 1;
            if (this.state.stone === 'S') this.setState({ stone: '' });
          }
          newBoard.toPlay = (newBoard.toPlay === 1) ? 2 : 1;
        }
      } else if (isOccupied && (stack.owner === newBoard.toPlay)) {
        this.toMove.stack = stack.stack.splice(0, newBoard.size);
        this.toMove.stone = stack.stone;
        stack.stone = '';
        stack.owner = stack.stack[0] || 0;
        stack.isOccupied = 0;
        this.isMoving = true;
      }
    } else if (stack.stone === '') {
      stack.place(this.toMove.stack.pop());
      if (!this.toMove.stack.length) {
        stack.stone = this.toMove.stone;
        this.toMove = {};
        this.isMoving = false;
        newBoard.toPlay = newBoard.toPlay === 1 ? 2 : 1;
      }
    } else if (stack.stone === 'S' &&
               this.toMove.stone === 'C' &&
               this.toMove.stack.length === 1) {
      stack.place(this.toMove.stack.pop(), 'C');
      this.isMoving = false;
      newBoard.toPlay = (newBoard.toPlay === 1) ? 2 : 1;
    }

    this.setState({
      game: newBoard
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
