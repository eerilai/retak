import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Game from './Game';
import Board from './Board';
import Stack from './Stack';
import Chat from './chat';
import Clock from './Clock';
import '../../styles/livegame.css';
import '../../styles/controlpanel.css';
import { convertCoord } from './gameUtil';
import PageNotFound from '../PageNotFound';
import SelectStoneButtons from './SelectStoneButtons';
import GameInfo from './GameInfo';

class LiveGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
      playerNumber: 1,
      stone: '',
      noRoom: false,
      myTime: 0,
      opponentTime: 0,
    };

    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.setStone = this.setStone.bind(this);
    this.timeOut = this.timeOut.bind(this);
    this.updateGame = this.updateGame.bind(this);

    const { socket, username } = props;
    const { roomId } = props.match.params;
    this.roomId = props.match.params;
    const loadGame = this.props.location.state ? this.props.location.state.game : null;

    socket.emit('fetchGame', username, roomId, loadGame);

    socket.on('syncGame', ({
      boardSize,
      gameState,
      player1Time,
      player2Time,
      status,
      player1,
      player2,
      roomId,
      activePlayer,
      isPlayer1,
    }) => {
      if (roomId === props.match.params.roomId) {
        const game = new Game(boardSize, gameState, player1, player2);
        game.activePlayer = activePlayer;

        if (this.props.username === player1) {
          this.setState({
            myTime: player1Time,
            opponentTime: player2Time,
            playerNumber: 1,
            game,
          });
        } else {
          this.setState({
            myTime: player2Time,
            opponentTime: player1Time,
            playerNumber: 2,
            game,
          });
        }
      }
    });

    socket.on('pendingGame', ({ boardSize, timeControl, roomId }) => {
      if (roomId === props.match.params.roomId) {
        const game = new Game(boardSize, 'new', this.props.username, this.props.username);
        game.activePlayer = this.props.username;
        this.setState({
          game,
        });
      }
    });

    socket.on('gameAccessDenied', (roomId) => {
      if (roomId === props.match.params.roomId) {
        this.setState({
          accessDenied: true,
        });
      }
    });

    socket.on('closedRoom', () => {
      this.setState({ noRoom: true });
    });
    socket.on('updateTime', ({ roomId, player1Time, player2Time }) => {
      if (roomId === props.match.params.roomId) {
        if (this.props.username === this.state.game.player1) {
          this.setState({
            myTime: player1Time,
            opponentTime: player2Time,
          });
        } else {
          this.setState({
            myTime: player2Time,
            opponentTime: player1Time,
          });
        }
      }
    });

    socket.on('timeOut', ({ activePlayer, roomId }) => {
      if (roomId === props.match.params.roomId) {
        this.timeOut(activePlayer);
      }
    });
  }

  setStone(stone) {
    if (this.state.game.turn !== 0) {
      if (stone === 'S' && this.state.stone === '') {
        this.setState({
          stone,
        });
      }
      this.setState({
        stone,
      });
    }
  }

  updateGame(updatedGame) {
    function emit() {
      const { socket, match } = this.props;
      const { game } = this.state;
      socket.emit('updateGame', {
        gameState: {
          ptn: game.ptn,
          tps: game.tps,
          victor: game.victor,
          winType: game.winType,
        },
        activePlayer: game.activePlayer,
        roomId: match.params.roomId,
      });
      // fix room not closing if resign if first move of game
      if (updatedGame.winType && updatedGame.player1 !== updatedGame.player2) {
        const {
          player1,
          player2,
          ptnString,
          tps,
          victorUsername,
          size,
          winType,
          ranked,
        } = updatedGame;
        const endOfGameState = {
          player1,
          player2,
          ptn: ptnString,
          tps,
          victor: victorUsername,
          size,
          winType,
          ranked,
        };
        socket.emit('closeGame', match.params.roomId, endOfGameState);
      }
    }

    this.setState({
      game: updatedGame,
    }, emit.bind(this));
  }

  movePieces(col, row) {
    const { game, stone } = this.state;
    const { socket, match } = this.props;
    game.selectStack(col, row, stone);
    if (stone !== '') {
      this.setState({
        stone: '',
      });
    }
    this.setState({
      game,
    });


    if (this.props.username !== game.activePlayer) {
      socket.emit('updateGame', {
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
      const endOfGameState = {
        player1,
        player2,
        ptn: ptnString,
        tps,
        victor: victorUsername,
        size,
        winType,
        ranked,
      };
      socket.emit('closeGame', match.params.roomId, endOfGameState);
    }
  }

  handleSquareClick(col, row) {
    if (this.props.username === this.state.game.activePlayer) {
      this.movePieces(col, row);
    }
  }

  timeOut(player) {
    const { game } = this.state;
    game.timeOut(player);
    this.setState({
      game,
    });
  }

  render() {
    const { game, stone, playerNumber } = this.state;

    if (!game) {
      return <Loader active size="massive" />;
    }

    if (this.state.noRoom) {
      return (
        <div className="retak">
          <div className="main">
            <PageNotFound />
          </div>
        </div>);
    }

    return (
      <div className="retak">
        <GameInfo
          game={game}
          updateGame={this.updateGame}
          playerNumber={playerNumber}
          myTime={this.state.myTime}
          opponentTime={this.state.opponentTime}
          roomId={this.roomId}
        />
        <div className="main">
          <div className="game">
            <Board
              game={game}
              handleSquareClick={this.handleSquareClick}
            />
            <SelectStoneButtons
              game={game}
              stone={stone}
              playerNumber={playerNumber}
              setStone={this.setStone}
            />
          </div>
        </div>
        <Chat />
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    username: state.currentUsername,
    socket: state.socket,
  }
);


export default withRouter(connect(mapStateToProps)(LiveGame));
