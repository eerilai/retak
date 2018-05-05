import React from "react";
import { Link } from "react-router-dom";
const Nav = props => (
  <div id="nav">
    <nav>
      <Link to="/">Home</Link>
    </nav>
    <nav>
      <Link to="/profile">Profile</Link>
    </nav>
    <nav>
      <Link to="/learn">Learn</Link>
    </nav>
    <nav>
      <Link to="/about">About</Link>
    </nav>
  </div>
);

export default Nav;
