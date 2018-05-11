import React from 'react';
import { Link } from 'react-router-dom';
import Lobby from './lobby';
import LeaderboardTable from "../../containers/Home/leaderboard_table";
import LobbyTable from "../../containers/Home/lobby_table";

const Home = props => (
  <div className="main">
    <div className="home home-grid">
      <div className="lobby">
        <Lobby socket={props.socket} />
      </div>
      <Link to="/game">
        <button className="createGame">Create Game</button>
      </Link>
      <div className="leaderboard">
        <LeaderboardTable />
      </div>
    </div>
  </div>
);

export default Home;
