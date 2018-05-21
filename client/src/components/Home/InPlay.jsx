import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

class InPlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
    }
    this.fetchGames();
  }

  fetchGames() {
    axios.get(`/users/${this.props.userID}/games/current`)
      .then((games) => {
        this.setState({
          games: games.data
        });
      });
  }

  render() {
    console.log(this.props.userID);
    let versus = '';
    return (
      <table class="tg">
        <tr>
          <th>Game</th>
          <th>Versus</th>
          <th>Board</th>
          <th>Turn</th>
          <th>To Play</th>
        </tr>
        {this.state.games.map(game => (
          <tr className="room">
            <td><Link to={{
              pathname: `/game/${game.room_id}`,
              state: { game }
            }}>{game.room_id}
            </Link></td>
            <td>{versus = this.props.username === game.player1 ? game.player2 : game.player1}</td>
            <td>{game.board_size} x {game.board_size}</td>
            <td>{game.ptn.length}</td>
            <td>{game.active_player}</td>
          </tr>
        ))}
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.currentUser,
    userID: state.userID,
  };
};

export default connect(mapStateToProps)(InPlay);
