/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import sound_brick_drop from "./Sounds/brick_drop_concrete.wav";
import Game from "./Game";
import Board from "./Board";
import Stack from "./Stack";
import Chat from "./chat"; // not in use currently
import PTN from "./PTN"
import "../../styles/livegame.css";
import { convertCoord } from "./gameUtil";
import {
  Input,
  Button,
  Header,
  Modal,
  Icon,
  Form,
  Select,
  Transition
} from 'semantic-ui-react';

class LiveGame extends Component {
  constructor(props) {
    super(props);
    const newGame = new Game(6);
    this.state = {
      game: newGame,
      stone: "",
      isOpen: true,
      user: props.currentUser,
    };
    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);

    const { socket, username } = props;
    const { roomId } = props.match.params;
    socket.emit('syncGame', {
      username,
      roomId
    });
    socket.on('playerJoin', ({ boardSize, player1, player2 }) => {
      const game = new Game(boardSize);
      game.player1 = player1;
      game.player2 = player2;
      game.activePlayer = player1;
      this.setState({
        game
      });
    });
    socket.on("opponentMove", ({ col, row, stone }) => {
      this.movePieces(col, row, false, stone);
    });

    //Sound Effect
    // this.sounds = { brick: sound_brick_drop };
  }

  movePieces(col, row, isPlayerMove, stone = this.state.stone) {
    const { game } = this.state;
    game.selectStack(col, row, stone);
    if (this.state.stone !== "") {
      this.setState({
        stone: ""
      });
    }
    this.setState({
      game
    });

    if (isPlayerMove) {
      this.props.socket.emit("updateGame", {
        col,
        row,
        stone,
        roomId: this.props.match.params.roomId,
      });
    }
  }

  handleSquareClick(col, row) {
    if (this.props.username === this.state.game.activePlayer) {
      this.movePieces(col, row, true);
      // this.play("brick");
    }
  }

  selectCapstone(stone) {
    if (this.state.game.pieces[this.state.game.toPlay].C > 0) {
      this.setState({
        stone
      });
    }
  }

  toggleStanding() {
    if (this.state.stone === "") {
      this.setState({ stone: "S" });
    } else {
      this.setState({ stone: "" });
    }
  }

  winner() {
    let winner = this.state.game.victorUsername;
    let loser = this.state.game.looserUsername;
    if (this.state.game.winType === '1/2') {
      return <p>{`It's a Draw! ${winner} wins!`}</p>;
    }
    else if (this.state.game.winType === '1/2' && this.state.game.isBoardFull){
      return (
        <div>
          <p>Board is Full <br/></p>
          <p>{`It's a Draw! ${winner} wins!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "R") {
      return (
        <div>
          <p>Road Complited <br/></p>
          <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "F" && this.state.game.isBoardFull) {
      return (
        <div>
          <p>Board is Full <br/></p>
          <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "F") {
      return (
        <div>
          <p>A Player Ran Out of Pieces <br/></p>
          <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>
        </div>
      );
    }
    else if (this.state.game.winType !== null) {
      return <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>;
    }
  }

  opponentTurn() {
    const { activePlayer } = this.state.game;
    if (activePlayer !== this.props.username) {
      return <div className="to-play">Waiting for Opponent...</div>;
    }
    return <div className="to-play" />;
  }
  
  userTurn() {
    const { activePlayer } = this.state.game;
    if (activePlayer === this.props.username) {
      return <div className="to-play">Your turn</div>;
    }
    return <div className="to-play" />;
  }

  render() {
    const { game, stone } = this.state;
    const { username, socket } = this.props;

    let PlayerPieces;
    let OpponentPieces;
    
    if (!game.player1) {
      PlayerPieces = <div></div>;
      OpponentPieces = <div></div>;
    } else if (this.props.username === game.player1) {
      PlayerPieces = (
        <div>
          <button className="btn-player1-piece" onClick={() => { this.toggleStanding(); }}>
            { stone === 'S' ? 'F' : 'S' }({ game.pieces[1].F })
          </button>
          <button className="btn-player1-piece" onClick={() => { this.selectCapstone('C'); }}>
          C ({game.pieces[1].C})
          </button>
        </div>
      );
      OpponentPieces = (
        <div className="score">
        <table>
          <tr style={{'font-size': '10px'}}><td>Flats</td><td>Capstones</td><td>Score</td></tr>
          <tr><td>{game.pieces[2].F}</td><td>{game.pieces[2].C}</td><td>{game.p2TotoalFlatsCnt}</td></tr>
        </table>
        </div>
      );
    } else {
      PlayerPieces = (
        <div>
          <button className="btn-player2-piece" onClick={() => { this.toggleStanding(); }}>
            { stone === 'S' ? 'F' : 'S' }({ game.pieces[2].F })
          </button>
          <button className="btn-player2-piece" onClick={() => { this.selectCapstone('C'); }}>
          C ({game.pieces[2].C})
          </button>
        </div>
      );
      OpponentPieces = (
        <div className="score">
        <table>
          <tr style={{'font-size': '10px'}}><td>Flats</td><td>Capstones</td><td>Score</td></tr>
          <tr><td>{game.pieces[1].F}</td><td>{game.pieces[1].C}</td><td>{game.p1TotalFlatsCnt}</td></tr>
        </table>
        </div>
      );
    }

    if (!game) {
      return <div></div>
    }
    return (
      <div className="takless">
        <div className="game-info">
          <div>{this.winner()}</div>
          {this.opponentTurn()}
          <table>
            {OpponentPieces}
            <tr>{this.state.game.player2}</tr>
            <PTN ptn={this.state.game.ptn} />
            <tr>{this.props.username}</tr>
          </table>
          {this.userTurn()}
        </div>
        <div className="main">
          <div className="game">
            <div className="board">
              <Board game={game} handleSquareClick={this.handleSquareClick} />
            </div>
            <div className="stone-select">
              <div className="active-stone">{stone}</div>
              {PlayerPieces}
            </div>
          </div>
        </div>
        <Chat socket={socket} />
      </div>
    );
  }

  //play sounds function
  play(src) {
    var sound = new Audio(this.sounds[src]);
    sound.play();
  }
}

const mapStateToProps = state => {
  return {
    username: state.currentUser
  };
};

export default withRouter(connect(mapStateToProps)(LiveGame));
