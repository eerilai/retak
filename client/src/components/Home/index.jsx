import React from "react";
import { Link } from "react-router-dom";

const Home = props => (
  <div className="home home-grid">
    <div className="lobby">
      <p>Lobby placeholder</p>
    </div>
    <Link to="/game">
      <button className="createGame">Create Game</button>
    </Link>
    <div className="leaderboard">
      <p>Leaderboard placeholder</p>
    </div>
  </div>
);

export default Home;
