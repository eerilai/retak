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
import PageNotFound from '../PageNotFound';
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
      stone: "",
      isOpen: true,
      user: props.currentUsername,
      opponentName: "",
      noRoom: false,
      myTime: 0,
      opponentTime: 0
    };

    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);
    this.timeOut = this.timeOut.bind(this);

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
            game
          });
        } else {
          this.setState({
            myTime: player2Time,
            opponentTime: player1Time,
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
    else if (this.state.game.winType === '1/2' && this.state.game.isBoardFull) {
      return (
        <div>
          <p>Board is Full <br /></p>
          <p>{`It's a Draw! ${winner} wins!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "R") {
      return (
        <div>
          <p>Road Completed <br /></p>
          <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "F" && this.state.game.isBoardFull) {
      return (
        <div>
          <p>Board is Full <br /></p>
          <p>{`Player ${winner} wins! & Player ${loser} lost!`}</p>
        </div>
      );
    } else if (this.state.game.winType === "F") {
      return (
        <div>
          <p>A Player Ran Out of Pieces <br /></p>
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
    const { game, stone } = this.state;
    const { socket } = this.props;

    if (!game) {
      return <Loader active size="massive" />
    }

    let PlayerPieces;
    let OpponentPieces;
    let topPlayerName, bottomPlayerName, topPlayerNo, bottomPlayerNo, color;
    if (this.props.username === game.player2) {
      topPlayerName = game.player1;
      bottomPlayerName = this.props.username;
      topPlayerNo = 1;
      bottomPlayerNo = 2;
      color = 'p2';
    } else {
      topPlayerName = game.player2;
      bottomPlayerName = game.player1;
      topPlayerNo = 2;
      bottomPlayerNo = 1;
      color = 'p1';
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

    let capActive = '', flatActive = '';
    let capSide = '', flatSide = '';
    let PieceSelect, CapSelect;
    if (stone === '' || stone === 'C') {
      if (stone === '') flatActive = 'active-stone', flatSide = 'piece-selected';
      if (stone === 'C') capActive = 'active-stone', capSide = 'piece-selected';
      PieceSelect = (
        <div className={`flat-toggle ${flatSide}`} onClick={() => { this.toggleStanding(); }}>
          <div className={`${flatActive} stone ${color}`} />
          <div className={`inactive stone S ${color}`} />
          <div className="flat-count">{game.pieces[bottomPlayerNo].F}</div>
        </div>
      );
    } else if (stone === 'S') {
      flatSide = 'piece-selected';
      PieceSelect = (
        <div className={`flat-toggle ${flatSide}`} onClick={() => { this.toggleStanding(); }}>
          <div className={`active-stone stone S ${color}`} />
          <div className={`inactive stone flat ${color}`} />
          <div className="flat-count">{game.pieces[bottomPlayerNo].F}</div>
        </div>
      );
    }
    if (game.pieces[bottomPlayerNo].C === 0) {
      CapSelect = (<div />)
    } else if (game.pieces[bottomPlayerNo].C === 1) {
      CapSelect = (
        <div className={`cap-select ${capSide}`}>
          <div className={`${capActive} stone C ${color}`} onClick={() => { this.selectCapstone('C'); }} />
        </div>
      )
    } else if (game.pieces[bottomPlayerNo].C === 2) {
      CapSelect = (
        <div className={`cap-select ${capSide}`}>
          <div className={`${capActive} stone C ${color}`} onClick={() => { this.selectCapstone('C'); }} />
          <div className={`${capActive} stone C ${color}`} onClick={() => { this.selectCapstone('C'); }} />
        </div>
      )
    }

    if (this.state.noRoom) {
      return (
        <div className="takless">
          <div className="main">
            <PageNotFound />
          </div>
        </div>);
    }
    if (!game) {
      return <div></div>
    }
    return (
      <div className="takless">
        <div className="game-info">
          <div>{this.winner()}</div>
          {/*this.opponentTurn()*/}
          <div className={`timer ${oppToPlay}`} style={{ 'border-bottom':'0' }}>
            {this.formatSeconds(this.state.opponentTime)}
          </div>
          <table>
            {OpponentPieces}
            <tr>{topPlayerName}</tr>
            <PTN ptn={game.ptn} />
            <tr>{bottomPlayerName}</tr>
            {PlayerPieces}
          </table>
          <div className={`timer ${pToPlay}`}style={{ 'border-top':'0' }}>
            {this.formatSeconds(this.state.myTime)}
          </div>
          {/*this.userTurn()*/}
        </div>
        <div className="main">
          <div className="game">
            <div className="board">
              <Board game={game} handleSquareClick={this.handleSquareClick} />
            </div>
            <div className="stone-select">
              {CapSelect}
              {PieceSelect}
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
    username: state.currentUsername,
    socket: state.socket
  };
};

export default withRouter(connect(mapStateToProps)(LiveGame));
