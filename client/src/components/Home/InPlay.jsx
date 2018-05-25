import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';

class InPlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { games } = this.props;
    return (
      <table className="tg correspondence">
        <thead>
          <tr>
            <th colSpan="5" className="title">
              <div>Correspondence Games</div>
            </th>
          </tr>
          <tr className="corr-th">
            <th className="corr-col-versus">Versus</th>
            <th className="corr-col-board">Board</th>
          </tr>
        </thead>
        <tbody>
        {games.map((game) => {
          const timeAgo = moment(game.updatedAt).fromNow();
          const versus = this.props.username === game.player1 ? game.player2 : game.player1;
          let playerTurn = game.active_player === this.props.username ? 'player-turn' : 'opponent-turn';

          return (
            <Popup
              content={`Last move: ${timeAgo}`}
              position="top center"
              trigger={
                <tr className="async-room">
                  <td>
                    <Link to={{
                      pathname: `/game/${game.room_id}`,
                      state: { game },
                    }}
                    >
                      {versus}
                    </Link>
                  </td>
                  <td>
                    <Link to={{
                      pathname: `/game/${game.room_id}`,
                      state: { game },
                    }}
                    >
                      {game.board_size} x {game.board_size}
                    </Link>
                  </td>
                  <td>
                    <div className={`${playerTurn}`} />
                  </td>
                </tr>
          } />
          );
        })}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.currentUsername,
    userID: state.userID,
    games: state.games,
  };
};

export default connect(mapStateToProps)(InPlay);
