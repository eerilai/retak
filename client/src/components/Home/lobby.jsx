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
    const games = this.state.games.sort((a, b) => { return a.players - b.players; });
    return (
      <table class="tg">
        <thead>
          <tr>
            <th colSpan="4" className="title">
              <h3>Lobby</h3>
            </th>
          </tr>
          <tr>
            <th className="col-room">Room</th>
            <th className="col-players">Player</th>
            <th className="col-time">Time</th>
            <th className="col-board">Board</th>
          </tr>
        </thead>
        {games.map((game) => {
          let players = <div />;
          if (game.players < 2) {
            if (game.player1) {
              players = (
                <div className="room-players">
                  <p><div className="white-icon" /> {`${game.player1}`}</p>
                </div>
              );
            } else if (game.player2) {
              players = (
                <div className="room-players">
                  <p><div className="black-icon" /> {`${game.player2}`}</p>
                </div>
              );
            }
          } else {
            players = (
              <div className="room-players">
                <p><div className="white-icon" /> {`${game.player1}`}</p>
                <p><div className="black-icon" /> {`${game.player2}`}</p>
              </div>
            );
          }
          const pending = game.isPending ? '(Open)' : '';
          return (
            <tr className="room">
              <td><Link to={`/game/${game.name}`}>{game.name} {pending}</Link></td>
              <td>
                <Link to={`/game/${game.name}`}>
                  {players}
                </Link>
              </td>
              <td><Link to={`/game/${game.name}`}>{game.timeControl}</Link></td>
              <td><Link to={`/game/${game.name}`}>{game.boardSize}</Link></td>
            </tr>
          )
        })}
      </table>
    );
  }
}

export default Lobby;
