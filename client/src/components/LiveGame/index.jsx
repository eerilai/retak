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
    socket.on("opponentMove", ({ col, row, stone, roomId }) => {
      if (roomId === props.match.params.roomId) {
        this.movePieces(col, row, false, stone);
      }
    });

    //Sound Effect
    this.sounds = { brick: sound_brick_drop };
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
      this.play("brick");
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
      return <h3>{`It's a Draw! ${winner} wins!`}</h3>;
    }
    else if (this.state.game.winType === '1/2' && this.state.game.isBoardFull){
      return (
        <div>
          <h3>Board is Full <br/></h3>
          <h3>{`It's a Draw! ${winner} wins!`}</h3>
        </div>
      );
    } else if (this.state.game.winType === "R") {
      return (
        <div>
          <h3>Road Complited <br/></h3>
          <h3>{`Player ${winner} wins! & Player ${loser} lost!`}</h3>
        </div>
      );
    } else if (this.state.game.winType === "F" && this.state.game.isBoardFull) {
      return (
        <div>
          <h3>Board is Full <br/></h3>
          <h3>{`Player ${winner} wins! & Player ${loser} lost!`}</h3>
        </div>
      );
    } else if (this.state.game.winType === "F") {
      return (
        <div>
          <h3>A Player Ran Out of Pieces <br/></h3>
          <h3>{`Player ${winner} wins! & Player ${loser} lost!`}</h3>
        </div>
      );
    }
    else if (this.state.game.winType !== null) {
      return <h3>{`Player ${winner} wins! & Player ${loser} lost!`}</h3>;
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
        <div>
          <p>{`F(${game.pieces[2].F}) / C(${game.pieces[2].C})`}</p>
          <h5>{game.player2}</h5>
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
        <div>
          <p>{`F(${game.pieces[1].F}) / C(${game.pieces[1].C})`}</p>
          <h5>{game.player1}</h5>
        </div>
      );
    }

    if (!game) {
      return <div></div>
    }
    return (
      <div className="takless">
        <div className="game-info">
          {this.opponentTurn()}
          <table>
            <tr>{this.state.game.player2}</tr>
            <PTN ptn={this.state.game.ptn} />
            <tr>{this.props.username}</tr>
          </table>
          {this.userTurn()}
        </div>
        <div className="main">
          <div className="game">
            <div className="stone-count">
              {OpponentPieces}
            </div>
            <div>{this.winner()}</div>
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
