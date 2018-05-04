import React from 'react';

const Home = props => (
  <div className="home home-grid">
    <div className="lobby">
      <p>Lobby placeholder</p>
    </div>
    <button className="createGame" onClick={() => props.changeView('game')} >Create Game</button>
    <div className="leaderboard">
      <p>Leaderboard placeholder</p>
    </div>

  </div>
);

export default Home;
