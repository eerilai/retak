import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import Nav from './Nav';
import Home from './Home';
import Learn from './Learn';
import About from './About';
import Profile from './Profile';
import Game from './LiveGame';
import Chat from './LiveGame/chat';
import { setAnonUsername, toggleLoginLogout, login } from '../actions/actions';

var sectionStyle = {
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};

class App extends Component {
  constructor(props) {
    super(props);

    const { socket } = props;
    axios
      .get('/auth/check')
      .then(res => {
        let currentUserInfo = res.data;
        let currentUsername = res.data.currentUsername;
        if (currentUserInfo[0] !== '<') {
          props.toggleLoginLogout(true);
          props.login(currentUserInfo);
        } else {
          socket.emit('AnonUserSession', props.username);
        }
      })
      .catch(err => {
        console.error(err);
      });
    socket.on('setAnonUsername', (username) => {
      props.setAnonUsername(username);
    });
  }

  render() {
    return (
      <div id="page" style={sectionStyle}>
        <Nav />
        <Switch>
          <Route path="/learn" component={Learn} />
          <Route path="/about" component={About} />
          <Route path="/profile/:userName" render={({ match }) => <Profile />} />
          <Route path="/profile" component={Profile} />
          <Route path="/game/:roomId" render={({ match }) => <Game />} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    username: state.currentUsername,
    isLoggedIn: state.isLoggedIn,
    socket: state.socket
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setAnonUsername, toggleLoginLogout, login }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));