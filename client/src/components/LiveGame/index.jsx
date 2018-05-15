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
    
    socket.emit('fetchGame', {
      username,
      roomId
    });
    
    socket.on('syncGame', ({ game, roomId }) => {
      if (roomId === props.match.params.roomId) {
        this.setState({
          game
        });
      }
    });

    socket.on('pendingGame', ({ game, roomId }) => {
      if (roomId === props.match.params.roomId) {
        game.player2 = username;
        this.setState({
          game
        });
      }
    });

    socket.on('gameAccessDenied', (roomId) => {
      if (roomId === props.match.params.roomId) {
        this.setState({
          accessDenied: true
        });
      }
    });

    //Sound Effect
    // this.sounds = { brick: sound_brick_drop };
  }

  movePieces(col, row) {
    const { game, stone } = this.state;
    game.selectStack(col, row, stone);
    if (this.state.stone !== "") {
      this.setState({
        stone: ""
      });
    }
    this.setState({
      game
    });

    this.props.socket.emit("updateGame", {
      col,
      row,
      stone,
      roomId: this.props.match.params.roomId,
    });
  }

  handleSquareClick(col, row) {
    if (this.props.username === this.state.game.activePlayer) {
      this.movePieces(col, row);
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
          <p>Road Completed <br/></p>
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
    let opponentName, opponentNo, playerNo, color;
    if (username === game.player1) {
      opponentName = game.player2;
      opponentNo = 2;
      playerNo = 1;
      color = 'btn-player1-piece';
    } else {
      opponentName = game.player1;
      opponentNo = 1;
      playerNo = 2;
      color = 'btn-player2-piece';
    }

    PlayerPieces = (
      <div className="score">
      <table>
        <tr><td>{`${game.pieces[playerNo].F} / ${game.pieces[playerNo].C}`}</td><td>{game[`p${playerNo}FlatScore`]}</td></tr>
        <tr style={{'font-size': '10px'}}><td>Stones</td><td>Score</td></tr>
      </table>
      </div>
    );
    OpponentPieces = (
      <div className="score">
      <table>
        <tr style={{'font-size': '10px'}}><td>Stones</td><td>Score</td></tr>
        <tr><td>{`${game.pieces[opponentNo].F} / ${game.pieces[opponentNo].C}`}</td><td>{game[`p${opponentNo}FlatScore`]}</td></tr>
      </table>
      </div>
    );

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
            <tr>{opponentName}</tr>
            <PTN ptn={this.state.game.ptn} />
            <tr>{this.props.username}</tr>
            {PlayerPieces}
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
              <button className={color} onClick={() => { this.toggleStanding(); }}>
                { stone === 'S' ? 'F' : 'S' }({ game.pieces[playerNo].F })
              </button>
              <button className={color} onClick={() => { this.selectCapstone('C'); }}>
              C ({game.pieces[playerNo].C})
              </button>
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
