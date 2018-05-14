import React from "react";
import AuthNav from "./AuthNav";
import { Link } from "react-router-dom";

const Nav = props => (
  <div id="nav">
    <div id="main-nav">
      <nav className="hvr-grow-shadow">
        <Link to="/">Home</Link>
      </nav>
      <nav className="hvr-grow-shadow">
        <Link to="/profile">Profile</Link>
      </nav>
      <nav className="hvr-grow-shadow">
        <Link to="/learn">Learn</Link>
      </nav>
      <nav className="hvr-grow-shadow">
        <Link to="/about">About</Link>
      </nav>
    </div>
    <div id="user-nav">
      <AuthNav />
    </div>
  </div>
);

export default Nav;
