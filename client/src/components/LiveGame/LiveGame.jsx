import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import Game from "./Game";
import Board from "./Board";
import Stack from "./Stack";
import Chat from "./chat";
import PTN from "./PTN";
import Clock from "./Clock";
import "../../styles/livegame.css";
import "../../styles/controlpanel.css";
import { convertCoord } from "./gameUtil";
import PageNotFound from '../PageNotFound';
import ControlPanel from './ControlPanel';
import SelectStoneButtons from './SelectStoneButtons';
import {
  Input,
  Button,
  Header,
  Modal,
  Icon,
  Form,
  Select,
  Transition,
  Loader,
  Popup
} from 'semantic-ui-react';

class LiveGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
      playerNumber: 1,
      stone: "",
      isOpen: true,
      user: props.currentUsername,
      opponentName: "",
      noRoom: false,
      myTime: 0,
      opponentTime: 0,
    };

    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
    this.toggleStanding = this.toggleStanding.bind(this);
    this.setStone = this.setStone.bind(this);
    this.timeOut = this.timeOut.bind(this);
    this.updateGame = this.updateGame.bind(this);

    const { socket, username } = props;
    const { roomId } = props.match.params;
    const loadGame = this.props.location.state ? this.props.location.state.game : null;
    
    socket.emit('fetchGame', username, roomId, loadGame);
    
    socket.on('syncGame', ({ boardSize, gameState, player1Time, player2Time, status, player1, player2, roomId, activePlayer, isPlayer1 }) => {
      if (roomId === props.match.params.roomId) {
        const game = new Game(boardSize, gameState, player1, player2);
        game.activePlayer = activePlayer;

        if (this.props.username === player1) {
          this.setState({
            myTime: player1Time,
            opponentTime: player2Time,
            playerNumber: 1,
            game
          });
        } else {
          this.setState({
            myTime: player2Time,
            opponentTime: player1Time,
            playerNumber: 2,
            game
          });
        }
      }
    });

    socket.on('pendingGame', ({ boardSize, timeControl, roomId }) => {
      if (roomId === props.match.params.roomId) {
        const game = new Game(boardSize, 'new', this.props.username, this.props.username);
        game.activePlayer = this.props.username;
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

    socket.on('closedRoom', () => {
      this.setState({ noRoom: true })
    });
    socket.on('updateTime', ({ roomId, player1Time, player2Time }) => {
      if (roomId === props.match.params.roomId) {
        if (this.props.username === this.state.game.player1) {

          this.setState({
            myTime: player1Time,
            opponentTime: player2Time
          })
        } else {
          this.setState({
            myTime: player2Time,
            opponentTime: player1Time
          })
        }
      }
    });

    socket.on('timeOut', ({ activePlayer, roomId }) => {
      if (roomId === props.match.params.roomId) {
        this.timeOut(activePlayer)
      }
    });
  }
  


  updateGame(game) {
    this.setState({
      game
    }, emit.bind(this));

    function emit() {
      const { socket, match } = this.props;
      const { game } = this.state;
      socket.emit("updateGame", {
        gameState: {
          ptn: game.ptn,
          tps: game.tps,
          victor: game.victor,
          winType: game.winType,
        },
        activePlayer: game.activePlayer,
        roomId: match.params.roomId,
      });
      //fix room not closing if resign if first move of game
      if (game.winType && game.player1 !== game.player2) {
        const { player1, player2, ptnString, tps, victorUsername, size, winType, ranked } = game;
        const endOfGameState = { player1, player2, ptn: ptnString, tps, victor: victorUsername, size, winType, ranked };
        socket.emit('closeGame', match.params.roomId, endOfGameState);
      }
    }
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


    if (this.props.username !== game.activePlayer) {

      socket.emit("updateGame", {
        gameState: {
          ptn: game.ptn,
          tps: game.tps,
        },
        activePlayer: game.activePlayer,
        roomId: match.params.roomId,
      });
    }

    if (game.winType && game.player1 !== game.player2) {
      const { player1, player2, ptnString, tps, victorUsername, size, winType, ranked } = game;
      const endOfGameState = { player1, player2, ptn: ptnString, tps, victor: victorUsername, size, winType, ranked };
      socket.emit('closeGame', match.params.roomId, endOfGameState);
    }

  }
  handleSquareClick(col, row) {
    if (this.props.username === this.state.game.activePlayer) {
      this.movePieces(col, row);
    }
  }

  selectCapstone(stone) {
    if (this.state.game.turn !== 0) {
      if (this.state.game.pieces[this.state.game.toPlay].C > 0) {
        this.setState({
          stone
        });
      }
    }
  }

  setStone(stone) {
    if (this.state.game.turn !== 0) {
      if (stone === 'S' && this.state.stone === '') {
        this.setState({
          stone,
        })
      }
      this.setState({
        stone,
      });
    }
  }

  toggleStanding() {
    if (this.state.game.turn !== 0) {
      if (this.state.stone === "") {
        this.setState({ stone: "S" });
      } else {
        this.setState({ stone: "" });
      }
    }
  }

  opponentTurn() {
    const { activePlayer, player1, player2 } = this.state.game;

    const isPlayer = this.props.username === player1 || this.props.username === player2;
    if (activePlayer !== this.props.username && isPlayer) {
      return <div className="to-play">Waiting for Opponent...</div>;
    } else if (isPlayer || activePlayer === player1) {
      return <div className="to-play" />;
    }
    return <div className="to-play">{player2}'s turn</div>;
  }

  userTurn() {
    const { activePlayer, player1, player2 } = this.state.game;

    const isPlayer = this.props.username === player1 || this.props.username === player2;
    if (activePlayer === this.props.username) {
      return <div className="to-play">Your turn</div>;
    } else if (isPlayer || activePlayer === player2) {
      return <div className="to-play" />;
    }
    return <div className="to-play">{player1}'s turn</div>;
  }


  formatSeconds = (totalSeconds) => {
    if (totalSeconds === undefined || totalSeconds === null) {
      return ''
    }

    if (totalSeconds === 0) {
      return <div> 00:00 </div>;
    }
    let seconds = totalSeconds % 60;
    let minutes = Math.floor(totalSeconds / 60);

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return <div>{minutes}:{seconds}</div>;

  };

  timeOut(player) {

    let game = this.state.game;
    game.timeOut(player);
    this.setState({
      game,
    });
  }

  render() {
    const { game, updateGame, stone, playerNumber } = this.state;
    const { socket } = this.props;

    if (!game) {
      return <Loader active size="massive" />
    }

    let PlayerPieces;
    let OpponentPieces;
    let topPlayerName, bottomPlayerName, topPlayerNo, bottomPlayerNo, color, oppColor;
    if (playerNumber === game.player2) {
      topPlayerName = game.player1;
      bottomPlayerName = this.props.username;
      topPlayerNo = 1;
      bottomPlayerNo = 2;
      color = 'p2';
      oppColor = 'p1';
    } else {
      topPlayerName = game.player2;
      bottomPlayerName = game.player1;
      topPlayerNo = 2;
      bottomPlayerNo = 1;
      color = 'p1';
      oppColor = 'p2';
    }

    let pToPlay, oppToPlay;
    if((game.toPlay === 1 && bottomPlayerNo === 1) || 
       (game.toPlay === 2 && bottomPlayerNo === 2)) {
      pToPlay = 'to-play';
      oppToPlay = '';
    } else {
      oppToPlay = 'to-play';
      pToPlay =  '';
    }

    if (game.player1 === game.player2) {
      topPlayerName = 'Waiting for Match...'
    }

    PlayerPieces = (
      <div className="score">
        <table>
          <tr><td>{`${game.pieces[bottomPlayerNo].F} / ${game.pieces[bottomPlayerNo].C}`}</td><td>{game[`p${bottomPlayerNo}FlatScore`]}</td></tr>
          <tr style={{ 'font-size': '10px' }}><td>Stones</td><td>Score</td></tr>
        </table>
      </div>
    );
    OpponentPieces = (
      <div className="score">
        <table>
          <tr style={{ 'font-size': '10px' }}><td>Stones</td><td>Score</td></tr>
          <tr><td>{`${game.pieces[topPlayerNo].F} / ${game.pieces[topPlayerNo].C}`}</td><td>{game[`p${topPlayerNo}FlatScore`]}</td></tr>
        </table>
      </div>
    );


    if (this.state.noRoom) {
      return (
        <div className="retak">
          <div className="main">
            <PageNotFound />
          </div>
        </div>);
    }
    if (!game) {
      return <div></div>
    }
    return (
      <div className="retak">
        <div className="game-info">
          <div className={`timer ${oppToPlay}`} style={{ 'border-bottom':'0' }}>
            {this.formatSeconds(this.state.opponentTime)}
          </div>
          <table>
            {OpponentPieces}
            <tr>{topPlayerName}</tr>
            <PTN ptn={game.ptn} victor={game.victor} winType={game.winType} full={game.isBoardFull}/>
            <ControlPanel game={game} updateGame={this.updateGame} socket={socket}/>
            <tr>{bottomPlayerName}</tr>
            {PlayerPieces}
          </table>
          <div className={`timer ${pToPlay}`}style={{ 'border-top':'0' }}>
            {this.formatSeconds(this.state.myTime)}
          </div>
        </div>
        <div className="main">
          <div className="game">
            <div className="board">
              <Board game={game} handleSquareClick={this.handleSquareClick} />
            </div>
            {// <div className="stone-select">
            //   {CapSelect}
            //   {PieceSelect}
            // </div>
          }
            <SelectStoneButtons 
              game={game}
              stone={stone}
              playerNumber={playerNumber}
              selectCapstone={this.selectCapstone}
              setStone={this.setStone}
            />
          </div>
        </div>
        <Chat />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.currentUsername,
    socket: state.socket
  };
};

export default withRouter(connect(mapStateToProps)(LiveGame));
