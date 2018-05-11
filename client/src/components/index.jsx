import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Nav from './Nav';
import Home from './Home';
import Learn from './Learn';
import About from './About';
import Profile from './Profile';
import Game from './LiveGame';
import Chat from './LiveGame/chat';
import socketIOClient from 'socket.io-client';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: socketIOClient()
    }
  }

  render() {
    return (
      <div id="page">
        <Nav />
        <Switch>
          <Route path='/learn' component={Learn} />
          <Route path='/about' component={About} />
          <Route path='/profile' component={Profile} />
          <Route path='/game' render={() => (<Game socket={this.state.socket} />)} />
          <Route path='/' render={() => (<Home socket={this.state.socket} />)} />
        </Switch>
      </div>
    );
  }
}
export default App;
