import React from "react";
import { Link } from "react-router-dom";
import Lobby from "./lobby";
const Home = props => (
  <div className="main">
    <div className="home home-grid">
      <div className="lobby">
        <Lobby />
      </div>
      <Link to="/game">
        <button className="createGame">Create Game</button>
      </Link>
      <div className="leaderboard">
        <p>Leaderboard placeholder</p>
      </div>
    </div>
  </div>
);

export default Home;
