import React from 'react';
import { Link } from 'react-router-dom';

const Leaderboard = ({ leaderboard }) => (
  <div className="leaderboard">
    <table className="tg">
      <thead>
        <tr>
          <th colSpan="5" className="title">
            <h3>Leaderboard</h3>
          </th>
        </tr>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Total Games</th>
          <th>
Win/Loss
            <span style={{ fontSize: '10px' }}>(Ranked)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {leaderboard
        /* .sort((a, b) => { FILTER BY RATIO INSTEAD OF TOTAL
              const aWR = a.ranked_wins / (a.ranked_games - a.ranked_wins);
              const bWR = b.ranked_wins / (b.ranked_games - b.ranked_wins);
              return bWR - aWR;
            }) */
          .map((user, no) => {
            const losses = user.ranked_losses;
            const userProfile = `/profile/${user.username}`;
            return (
              <tr className="room" key={user.username}>
                <td><Link to={userProfile}>{no + 1}</Link></td>
                <td><Link to={userProfile}>{user.username}</Link></td>
                <td><Link to={userProfile}>{user.total_games}</Link></td>
                <td><Link to={userProfile}>{`${user.ranked_wins}W—${losses}L`}</Link></td>
              </tr>
            );
          })}
      </tbody>
    </table>
  </div>
);

export default Leaderboard;
