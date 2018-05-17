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
      <table>
        <tr>
          <th>Player</th>
          <th>Mode</th>
          <th>Board</th>
          <th>Status</th>
        </tr>
        {this.state.games.map(game => (
          <tr className="room">
            <td><Link to={`/game/${game.name}`}>{game.name}</Link></td>
            <td>FILL ME IN</td>
            <td>{game.boardSize}</td>
            <td>{game.isPending ? 'pending...' : 'active'}</td>
          </tr>
        ))}
      </table>
    );
  }
}

export default Lobby;
