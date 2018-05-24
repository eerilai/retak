import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Lobby from './lobby';
import InPlay from './InPlay';
import Leaderboard from './Leaderboard';
import LobbyTable from '../../containers/Home/lobby_table';
import GameSetup from './Modals/GameSetup';
import GameLink from './Modals/GameLink';
import generateRoomName from './roomNames';

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
    };
    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.changeView = this.changeView.bind(this);
    this.getLeaderboard();
  }

  changeView(modalView) {
    this.setState({
      modalView,
    });
  }

  handleCreateGame(boardSize, timeControl, timeIncrement, isFriendGame, isPrivate, isLive, roomId, color) {
    console.log('time', timeControl);
    if (boardSize) {
      if (!roomId) {
        roomId = generateRoomName();
      }
      const { socket } = this.props;
      var timer
      if (+timeControl !== 0) {
        timer = timeControl * 60
      } else {
        timer = undefined
      }
      console.log(timer);
      socket.emit('createGame', {
        boardSize,
        timeControl: timer,
        timeIncrement: Number(timeIncrement),
        isFriendGame,
        isPrivate,
        isLive,
        color,
        roomId
      });
      socket.on('gameInitiated', ({ roomId }) => {
        // TODO: Change URL from localhost to takless for deployment
        let url = `http://localhost:3000/game/${roomId}`;
        let link = `game/${roomId}`;
        this.setState({
          url,
          link,
          modalView: 'GameLink'
        });
      });
    }
  }

  getLeaderboard() {
    axios.get('/leaderboard')
      .then((board) => {
        this.setState({ leaderboard: board.data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    let lobbyDisplay = '';
    if (this.state.lobbyView === 'lobby') {
      lobbyDisplay = <Lobby socket={this.props.socket} />;
    } else if (this.state.lobbyView === 'in_play') {
      lobbyDisplay = <InPlay />;
    }

    return (
      <div className="takless">
        <div className="main">
          <span style={{ cursor: 'pointer' }} onClick={() => { this.setState({ lobbyView: 'lobby' }); }}>Lobby /</span>
          <span style={{ cursor: 'pointer' }} onClick={() => { this.setState({ lobbyView: 'in_play' }); }}> In Play</span>
          <div className="lobby">
            {lobbyDisplay}
          </div>
          <button className="createGame">Play with Bot</button>
          <button
            className="createGame"
            onClick={() =>
              this.setState({
                modalView: 'GameSetup',
                gameType: 'general'
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
                gameType: 'friend'
              });
            }}
          >
            Play with friend
          </button>
          <GameSetup
            modalView={this.state.modalView}
            gameType={this.state.gameType}
            changeView={this.changeView}
            handleCreateGame={this.handleCreateGame}
          />
          <GameLink
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

const mapStateToProps = (state) => {
  return {
    username: state.currentUsername,
    socket: state.socket
  };
};

export default withRouter(connect(mapStateToProps)(Home));
