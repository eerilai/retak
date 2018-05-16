import React from 'react';

const Leaderboard = ({ leaderboard }) => {
  return (
    <div className="leaderboard">
      <table class="tg">
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
            <th>Ranked W/L</th>
          </tr>
        </thead>
        {leaderboard.map((user, no) => {
          const losses = user.ranked_games - user.ranked_wins;
          return (
            <tr>
              <td>{no + 1}</td>
              <td>{user.username}</td>
              <td>{user.total_games}</td>
              <td>{`${user.ranked_wins}/${losses}`}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Leaderboard;
