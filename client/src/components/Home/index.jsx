import React from "react";
import { Link } from "react-router-dom";
import Lobby from "./lobby";
import LeaderboardTable from "../../containers/Home/leaderboard_table";
import LobbyTable from "../../containers/Home/lobby_table";

const Home = props => (
  <div className="takless">
    <div className="main">
      <div className="lobby">
        <Lobby socket={props.socket} />
      </div>
      <button className="createGame hvr-skew-forward">Play with Bot</button>
      <Link to="/game">
        <button className="createGame hvr-skew-forward">Create Game</button>
      </Link>

      <button className="createGame hvr-skew-forward">Play with Friend</button>

      <div className="leaderboard ">
        <LeaderboardTable />
      </div>
    </div>
  </div>
);

export default Home;
