import React from "react";
import AuthNav from "./AuthNav";
import { Link } from "react-router-dom";

const Nav = props => (
  <div id="nav">
    <div id="main-nav">
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <nav>
        <Link to="/learn">Learn</Link>
      </nav>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </div>
    <AuthNav />
  </div>
);

export default Nav;
