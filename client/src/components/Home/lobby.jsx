import React, { Component } from "react";
import { Link } from "react-router-dom";


class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      socket: props.socket
    };
    this.joinGame = this.joinGame.bind(this);

    const { socket } = props;
    socket.emit('fetchLobby');
    socket.on('updateLobby', (data) => {
      this.setState({
        games: data,
      });
    });
  }

  joinGame(name) {
    console.log('join game fired');
    const { socket } = this.state;
    console.log('')
    socket.emit('joinGame', name);
  }

  render() {
    return (
      <table>
        <tr>
          <th>Player</th>
          <th>Mode</th>
        </tr>
        {this.state.games.map((game) => (
          <tr className="room">
            <td><Link to="/game" onClick={() => {this.joinGame(game.name)}}>{game.name}</Link></td>
          </tr>
        ))}
      </table>
    );
  }
}

export default Lobby;
