import React, { Component } from 'react';

const UserInfo = ({ userInfo }) => {
  
  return (
    <div className="userInfo">
      {/* <img /> */}
      <div> Username: {userInfo.username}</div>
      <div> Total Games: {userInfo.total_games}</div>
      <div> Total Ranked Games: {userInfo.ranked_games}</div>
      <div> Ranked Wins: {userInfo.ranked_wins}</div>
    </div>
  )
}

export default UserInfo;