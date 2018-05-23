/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import sound_brick_drop from "./Sounds/brick_drop_concrete.wav";
import Game from "./Game";
import Board from "./Board";
import Stack from "./Stack";
import Chat from "./chat";
import PTN from "./PTN";
import Clock from "./Clock";
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
  Transition,
  Loader
} from 'semantic-ui-react';

class LiveGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
      timeControl: false,
      stone: "",
      isOpen: true,
      user: props.currentUser,
      opponentName: "",
      myCounter: false,
      opponentCounter: false,
      myTimeLeft: 0,
      opponentTimeLeft: 0
    };
    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
    this.timeOut = this.timeOut.bind(this);
    this.updateTime = this.updateTime.bind(this);

    const { socket, username } = props;
    const { roomId } = props.match.params;
    console.log(socket);
    const loadGame = this.props.location.state ? this.props.location.state.game : null;
    socket.emit('fetchGame', username, roomId, loadGame);

    socket.on('syncGame', ({ boardSize, gameState, timeControl, player1, player2, roomId, activePlayer }) => {
      if (roomId === props.match.params.roomId) {
        const game = new Game(boardSize, gameState, player1, player2);
        game.activePlayer = activePlayer;
        game.timeControl = timeControl;
        game.player1CurrentTime = timeControl;
        game.player2CurrentTime = timeControl;

        if (username === player1) {
          this.setState({
            mycurrentTime: game.player1CurrentTime,
            opponentCurrentTime: game.player2CurrentTime
          });
        } else {
          this.setState({
            mycurrentTime: game.player2CurrentTime,
            opponentCurrentTime: game.player2CurrentTime
          });
        }

        let opponent;
        if (this.props.username === player1) {
          opponent = player2;
        } else {
          opponent = player1;
        }

        this.setState({
          game,
          timeControl: game.timeControl,
          opponentName: opponent,
        });

        if (this.props.username === game.activePlayer) {
          this.setState({
            myCounter: true,
            opponentCounter: false
          });
        } else {
          this.setState({
            myCounter: false,
            opponentCounter: true
          });
        }
      }
    });

    socket.on('pendingGame', ({ boardSize, timeControl, roomId }) => {
      if (roomId === props.match.params.roomId) {
        const game = new Game(boardSize, 'new', username, username);
        game.activePlayer = username;
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
    const { socket, match } = this.props;
    game.selectStack(col, row, stone);
    if (stone !== "") {
      this.setState({
        stone: ""
      });
    }
    this.setState({
      game
    });
    if (!game.winType) {
      if (this.props.username !== game.activePlayer) {
        this.setState({
          myCounter: false,
          opponentCounter: true
        });

        socket.emit("updateGame", {
          gameState: {
            ptn: game.ptn,
            tps: game.tps
          },
          activePlayer: game.activePlayer,
          roomId: match.params.roomId,
        });
      } else {
        this.setState({
          myCounter: true,
          opponentCounter: false
        });
      }
    } else if (game.player1 !== game.player2) {
      const { player1, player2, ptnString, tps, victorUsername, size, winType, ranked } = game;
      const endOfGameState = { player1, player2, ptn: ptnString, tps, victor: victorUsername, size, winType, ranked };
      socket.emit('closeGame', match.params.roomId, endOfGameState);
    }
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
    let loser = this.state.game.loserUsername;
    if (this.state.game.winType === '1/2') {
      return <p>{`It's a Draw!`}</p>;
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
    } else if (this.state.game.winType === "T") {
      return (
        <div>
          <p>{`Player ${loser} ran out of time`}<br /></p>
          <p>{`Player ${winner} wins!`}</p>
        </div>
      );
    }
    else if (this.state.game.winType !== null) {
      return <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>;
    }
  }

  opponentTurn() {
    const { activePlayer, player1, player2 } = this.state.game;
    const { username } = this.props;
    const isPlayer = username === player1 || username === player2;
    if (activePlayer !== username && isPlayer) {
      return <div className="to-play">Waiting for Opponent...</div>;
    } else if (isPlayer || activePlayer === player1) {
      return <div className="to-play" />;
    }
    return <div className="to-play">{player2}'s turn</div>;
  }
  
  userTurn() {
    const { activePlayer, player1, player2 } = this.state.game;
    const { username } = this.props;
    const isPlayer = username === player1 || username === player2;
    if (activePlayer === username) {
      return <div className="to-play">Your turn</div>;
    } else if (isPlayer || activePlayer === player2) {
      return <div className="to-play" />;
    }
    return <div className="to-play">{player1}'s turn</div>;
  }

  updateTime(player, currentTime) {
    if (this.props.username === player) {
      this.setState({
        mycurrentTime: currentTime
      });
    } else {
      this.setState({
        opponentCurrentTime: currentTime
      });
    }
  }

  timeOut(player) {
    let game = this.state.game;
    game.timeOut(player);
    this.setState({
      game,
      myCounter: false,
      opponentCounter: false
    });
  }

  render() {
    const { game, stone } = this.state;
    const { username, socket } = this.props;

    if (!game) {
      return <Loader active size="massive" />
    }

    let PlayerPieces;
    let OpponentPieces;
    let topPlayerName, bottomPlayerName, topPlayerNo, bottomPlayerNo, color;
    if (username === game.player2) {
      topPlayerName = game.player1;
      bottomPlayerName = username;
      topPlayerNo = 1;
      bottomPlayerNo = 2;
      color = 'btn-player2-piece';
    } else {
      topPlayerName = game.player2;
      bottomPlayerName = game.player1;
      topPlayerNo = 2;
      bottomPlayerNo = 1;
      color = 'btn-player1-piece';
    }

    if (game.player1 === game.player2) {
      topPlayerName = 'Waiting for Match...'
    }

    PlayerPieces = (
      <div className="score">
      <table>
        <tr><td>{`${game.pieces[bottomPlayerNo].F} / ${game.pieces[bottomPlayerNo].C}`}</td><td>{game[`p${bottomPlayerNo}FlatScore`]}</td></tr>
        <tr style={{'font-size': '10px'}}><td>Stones</td><td>Score</td></tr>
      </table>
      </div>
    );
    OpponentPieces = (
      <div className="score">
      <table>
        <tr style={{'font-size': '10px'}}><td>Stones</td><td>Score</td></tr>
        <tr><td>{`${game.pieces[topPlayerNo].F} / ${game.pieces[topPlayerNo].C}`}</td><td>{game[`p${topPlayerNo}FlatScore`]}</td></tr>
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
          <div>
            <Clock
              updateTime={this.updateTime}
              player={this.state.opponentName}
              time={this.state.timeControl}
              currentTime={this.state.opponentCurrentTime}
              shouldCount={this.state.opponentCounter}
              timeOut={this.timeOut}
            />
          </div>
          {this.opponentTurn()}
          <table>
            {OpponentPieces}
            <tr>{topPlayerName}</tr>
            <PTN ptn={game.ptn} />
            <tr>{bottomPlayerName}</tr>
            {PlayerPieces}
          </table>
          {this.userTurn()}
          <div>
            <Clock
              updateTime={this.updateTime}
              player={username}
              time={this.state.timeControl}
              currentTime={this.state.mycurrentTime}
              shouldCount={this.state.myCounter}
              timeOut={this.timeOut}
            />
          </div>
        </div>
        <div className="main">
          <div className="game">
            <div className="board">
              <Board game={game} handleSquareClick={this.handleSquareClick} />
            </div>
            <div className="stone-select">
              <div className="active-stone">{stone}</div>
              <button className={color} onClick={() => { this.toggleStanding(); }}>
                { stone === 'S' ? 'F' : 'S' }({ game.pieces[bottomPlayerNo].F })
              </button>
              <button className={color} onClick={() => { this.selectCapstone('C'); }}>
              C ({game.pieces[bottomPlayerNo].C})
              </button>
            </div>
          </div>
        </div>
        <Chat />
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
    username: state.currentUser,
    socket: state.socket
  };
};

export default withRouter(connect(mapStateToProps)(LiveGame));
