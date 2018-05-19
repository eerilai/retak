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
    return (
      <table class="tg">
        <tr>
          <th>Room</th>
          <th>Board</th>
          <th>Turn</th>
          <th>toPlay</th>
        </tr>
        {this.state.games.map(game => (
          <tr className="room">
            <td><Link to={{
              pathname: `/game/${game.room_id}`,
              state: { game }
            }}>{game.room_id}
            </Link></td>
            <td>{game.board_size}</td>
            <td>{game.board_state[game.board_state.length - 6]}</td>
          </tr>
        ))}
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.userID,
  };
};

export default connect(mapStateToProps)(InPlay);
