import React from "react";
import { Component } from 'react';
import { Link } from "react-router-dom";

import LeaderboardTable from "../../containers/Home/leaderboard_table";
import LobbyTable from "../../containers/Home/lobby_table";

const Home = props => (
  <div className="home home-grid">
    <div className="lobby">
      <LobbyTable />
    </div>
    <Link to="/game">
      <button className="createGame">Create Game</button>
    </Link>
    <div className="leaderboard">
      <LeaderboardTable />
    </div>
  </div>
);

export default Home;
