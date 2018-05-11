import React from 'react';
import { Component } from  'react';
import { connect } from 'react-redux';

class LeaderboardTable extends Component {

// This section is just a templeate and not currently being used.
// It needs to FILLLLED IN once the correct data stucture has been determined.
  renderLeaderboard(userData){
    const userId = userData.userId;
    const wins = userData.wins;
    const losses = userData.losses;
    const totalScore = userData.totalScore;
    const rank = userData.rank;

    return (
      <tr key={gameId}>
        <td class="tg-row">Cat {username}</td>
        <td class="tg-row">20 {wins}</td>
        <td class="tg-row">10 {losses}</td>
        <td class="tg-row">200 {totalScore}</td>
        <td class="tg-row">2 {rank}</td>
      </tr>
    );
  }

render() {
  return (
    
    <div class="tg-wrap"><table id="tg-1ngJI" class="tg">
      <thead>
        <tr>
          <th colSpan="5" class="title">
            <h4>Leaderboard</h4>
          </th>
        </tr>
        <tr>
          <th class="tg-colName1">User</th>
          <th class="tg-colNames">Wins</th>
          <th class="tg-colNames">Losses</th>
          <th class="tg-colNames">Total Score</th>
          <th class="tg-colNames">Rank</th>
        </tr>
      </thead>
      <tbody>
        {/* {this.props.user.map(this.renderLeaderboard)} */}
        <tr>
          <td class="tg-row">Cat</td>
          <td class="tg-row">20</td>
          <td class="tg-row">10</td>
          <td class="tg-row">200</td>
          <td class="tg-row">2</td>
        </tr>
        <tr>
          <td class="tg-row">Dog</td>
          <td class="tg-row">40</td>
          <td class="tg-row">20</td>
          <td class="tg-row">400</td>
          <td class="tg-row">1</td>
        </tr>
      </tbody>
    </table></div>
    )
  }
}

// This section is just a templeate and not currently being used.
// It needs to FILLLLED IN once the correct data stucture has been determined.
// function mapStateToProps({ users }) {
//   return { users };
// }

// export default connect(mapStateToProps)(LeaderboardTable);
export default LeaderboardTable;