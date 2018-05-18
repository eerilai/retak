import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Icons, Image } from 'semantic-ui-react';

const UserHistory = ({ userHistory }) => {
  const eachUserGame = userHistory.map((user) => {
    const losses = user.ranked_games - user.ranked_wins;
    const time = moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    
    const player1UserProfile = `/profile/${user.player1}`;
    const player2UserProfile = `/profile/${user.player2}`;

    let typeOfWin = '';
    if (user.win_type === 'R') {
      typeOfWin = 'Road Win';
    } 
    else if (user.win_type === 'F') {
      typeOfWin = 'Flat Win'
    }
    else if (user.win_type === '1') {
      typeOfWin = 'Resegnation Win or Time Ran Out'
    }
    else if (user.win_type === '1/2') {
      typeOfWin = 'Draw'
    }
    
    return (
      <div key={user.id} className="eachGame">
        <div>Played On: {time}</div>
        <div>
          <Link to={player1UserProfile}> {user.player1}</Link>  VS  <Link to={player2UserProfile}> {user.player2} </Link>
        </div>
        <div>Victor: {user.victor}</div>
        <div>{typeOfWin}</div>
        <div>Board Size: {user.board_size}</div>
        <div>PTN: {user.ptn}</div>
      </div>
    );
  });

  const noHistory = (
    <div>You haven't played a game yet...</div>
  );

  return (
    <div className="userHistory"> 
      <table class="tg">
       <thead>
          <th colSpan="5" className="title">
            <h3>Game History</h3>
          </th>
        </thead>
        {(userHistory.length) ? eachUserGame : noHistory}
      </table>
    </div>
  );
}

export default UserHistory;