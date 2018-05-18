import React, { Component } from 'react';
import moment from 'moment';

const UserHistory = ({ userHistory }) => {
  console.log("userHistory", userHistory)
  const eachUserGame = userHistory.map((user) => {
    const losses = user.ranked_games - user.ranked_wins;
    const time = moment(user.createdAt.slice(0, 19)).format('MMMM Do YYYY, h:mm:ss a');
    let typeOfWin = '';
    if(user.win_type === 'R') {
      typeOfWin = 'Road Win';
    }
    // if(){}
    
    return (
      <div key={user.id} className="eachGame">
        <div>Played On: {time}</div>
        <div>{user.player1} vs {user.player2}</div>
        <div>Victor: {user.victor}</div>
        <div>{typeOfWin}</div>
        <div>Board Size: {user.board_size}</div>
        <div>PTN: {user.ptn}</div>
      </div>
    );
  });

  return (
    <div className="leaderboard"> 
      <table class="tg">
       <thead>
          <tr>
            <th colSpan="5" className="title">
              <h3>Game History</h3>
            </th>
          </tr>
        </thead>
        {eachUserGame}
      </table>
    </div>
  );
}

export default UserHistory;