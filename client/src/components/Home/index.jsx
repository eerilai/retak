import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Lobby from './lobby';
import Leaderboard from './Leaderboard';
import LobbyTable from '../../containers/Home/lobby_table';
import { connect } from 'react-redux';
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
import GameSetup from './Modals/GameSetup';
import GameLink from './Modals/GameLink';
import generateRoomName from './roomNames';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: '',
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
      modalView
    });
  }

  handleCreateGame(boardSize, isFriendly, isPrivate, roomName) {
    if (!roomName) {
      roomName = generateRoomName();
    }
    const { socket, username } = this.props;
    socket.emit('createGame', {
      username,
      boardSize,
      isFriendly,
      isPrivate,
      roomName
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
    const options = [
      { key: '8', text: '8', value: '8' },
      { key: '7', text: '7', value: '7' },
      { key: '6', text: '6', value: '6' },
      { key: '5', text: '5', value: '5' },
      { key: '4', text: '4', value: '4' },
      { key: '3', text: '3', value: '3' }
    ];    
    return (
      <div className="takless">
        <div className="main">
          <div className="lobby">
            <Lobby socket={this.props.socket} />
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
              handleCreateGame={this.handleCreateGame} />
          <GameLink
            modalView={this.state.modalView}
            gameType={this.state.gameType}            
            changeView={this.changeView}
            url={this.state.url}
            link={this.state.link} />      

          <Leaderboard leaderboard={this.state.leaderboard} />
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    username: state.currentUser,
    socket: state.socket
  };
};

export default withRouter(connect(mapStateToProps)(Home));