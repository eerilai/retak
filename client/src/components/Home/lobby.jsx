import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      socket: props.socket
    };

    const { socket } = props;
    socket.emit('fetchLobby');
    socket.on('updateLobby', (data) => {
      this.setState({
        games: data,
      });
    });
  }

  render() {
    return (
      <table class="tg">
        <thead>
        <tr>
            <th colSpan="4" className="title">
              <h3>Lobby</h3>
            </th>
          </tr>
          <tr>
            <th>Room</th>
            <th>Mode</th>
            <th>Board</th>
            <th>Status</th>
          </tr>
        </thead>
        {this.state.games.map(game => (
          <tr className="room">
            <td><Link to={`/game/${game.name}`}>{game.name}</Link></td>
            <td>-</td>
            <td>{game.boardSize}</td>
            <td>{game.isPending ? 'pending...' : 'active'}</td>
          </tr>
        ))}
      </table>
    );
  }
}

export default Lobby;
