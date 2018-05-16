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
            <th>Win/Loss <span style={{ 'font-size':'10px' }}>(Ranked)</span></th>
          </tr>
        </thead>
        {leaderboard
          /* .sort((a, b) => { FILTER BY RATIO INSTEAD OF TOTAL
            const aWR = a.ranked_wins / (a.ranked_games - a.ranked_wins);
            const bWR = b.ranked_wins / (b.ranked_games - b.ranked_wins);
            return bWR - aWR;
          }) */
          .map((user, no) => {
          const losses = user.ranked_games - user.ranked_wins;
          return (
            <tr>
              <td>{no + 1}</td>
              <td>{user.username}</td>
              <td>{user.total_games}</td>
              <td>{`${user.ranked_wins}W—${losses}L`}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Leaderboard;
