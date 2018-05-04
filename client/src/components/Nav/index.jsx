import React from 'react';

const Nav = props => (
  <div id="nav">
    <nav onClick={() => { props.changeView('home'); }}>Home</nav>
    <nav>(Profile)</nav>
    <nav>(Learn)</nav>
    <nav>(About)</nav>
  </div>
);

export default Nav;
