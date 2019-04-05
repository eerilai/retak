import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Lobby from './lobby';
import InPlay from './InPlay';
import Leaderboard from './Leaderboard';
import GameSetup from './Modals/GameSetup';
import GameLink from './Modals/GameLink';
import { SITE_URL } from '../../copy';
import generateRoomName from './roomNames';
import MyModal from '../Util/Modal';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: '',
      lobbyView: 'lobby',
      gameType: '',
      url: '',
      link: '',
      leaderboard: [],
      boardSize: '',
      timeControl: '',
      timeIncrement: '',
      isFriendGame: '',
      isPrivate: '',
      isLive: '',

    };
    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.changeView = this.changeView.bind(this);
    this.getLeaderboard();
  }

  getLeaderboard() {
    axios.get('/leaderboard')
      .then((board) => {
        this.setState({ leaderboard: board.data });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleCreateGame(
    boardSize,
    timeControl,
    timeIncrement,
    isFriendGame,
    isPrivate,
    isLive,
    roomId,
    color,
  ) {
    if (boardSize) {
      if (!roomId) {
        roomId = generateRoomName();
      }
      const { socket } = this.props;
      let timer;
      if (+timeControl !== 0) {
        timer = timeControl * 60;
      } else {
        timer = undefined;
      }

      this.setState({
        boardSize,
        timeControl,
        timeIncrement,
        isFriendGame,
        isPrivate,
        isLive,
        color,
      });
      socket.emit('createGame', {
        boardSize,
        timeControl: timer,
        timeIncrement: Number(timeIncrement),
        isFriendGame,
        isPrivate,
        isLive,
        color,
        roomId,
      });
      socket.on('gameInitiated', ({ roomId }) => {
        const url = `${SITE_URL}/game/${roomId}`;
        const link = `game/${roomId}`;
        this.setState({
          url,
          link,
          modalView: 'GameLink',
        });
      });
    }
  }

  changeView(modalView) {
    this.setState({
      modalView,
    });
  }

  render() {
    const {
      boardSize,
      timeControl,
      timeIncrement,
      isPrivate,
      isLive,
      color,
    } = this.state;

    return (
      <div className="retak">
        <MyModal mountTo="game-list" isOpen>
          <p>Help</p>
        </MyModal>
        <div className="left">
          <h1 id="logo"><span id="sub-logo">re</span><b>tak</b></h1>
          <button
            className="createGame"
            onClick={() =>
              this.setState({
                modalView: 'GameSetup',
                gameType: 'general',
              })
            }
          >
            Create Game
          </button>
          <button
            className="createGame"
            onClick={() => {
              this.setState({
                modalView: 'GameSetup',
                gameType: 'friend',
              });
            }}
          >
            Play with Friend
          </button>
          <InPlay />
        </div>
        <div className="main">
          <div className="game-list" id="game-list">
            <Lobby socket={this.props.socket} />
          </div>
          <GameSetup
            modalView={this.state.modalView}
            gameType={this.state.gameType}
            changeView={this.changeView}
            handleCreateGame={this.handleCreateGame}
          />
          <GameLink
            boardSize={boardSize}
            timeControl={timeControl}
            timeIncrement={timeIncrement}
            color={color}
            isPrivate={isPrivate}
            isLive={isLive}
            modalView={this.state.modalView}
            gameType={this.state.gameType}
            changeView={this.changeView}
            url={this.state.url}
            link={this.state.link}
          />
          <Leaderboard leaderboard={this.state.leaderboard} />
        </div>
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

export default withRouter(connect(mapStateToProps)(Home));
