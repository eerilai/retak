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
      username: ''
    };
    this.toMove = [];
    this.isMoving = false;
    this.select = this.select.bind(this);
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

  select(col, row) {
    const newBoard = this.state.game;
    const stack = newBoard.board[col][row];
    const { isOccupied } = stack;
    if (!this.isMoving) {
      if (!isOccupied) {
        if (newBoard.toPlay === 1) {
          newBoard.board[col][row].place(1);
          newBoard.toPlay = 2;
        } else if (newBoard.toPlay === 2) {
          newBoard.board[col][row].place(2);
          newBoard.toPlay = 1;
        }
      } else if (isOccupied && stack.owner === newBoard.toPlay) {
        this.toMove = stack.stack;
        newBoard.board[col][row] = new Stack();
        this.isMoving = true;
      }
    } else {
      stack.place(this.toMove.shift());
      if (!this.toMove.length) {
        this.isMoving = false;
        newBoard.toPlay = newBoard.toPlay === 1 ? 2 : 1;
      }
    }

    this.setState({
      game: newBoard
    });
  }

  render() {
    return (
      <div className="main">
        <div className="home game">
          <div className="board">
            <Board game={this.state.game} select={this.select} />
          </div>
          <Chat username={this.state.username} />
        </div>
      </div>
    );
  }
}

export default LiveGame;
