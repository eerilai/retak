import React from 'react';
import AuthNav from './AuthNav';

// TODO: Profile should be conditional based on whether user islogged in
const Nav = props => (
  <div id="nav">
    <nav onClick={() => { props.changeView('home'); }}>Home</nav>
    <nav>(Profile)</nav>
    <nav>(Learn)</nav>
    <nav>(About)</nav>
    <AuthNav />
  </div>
);

export default Nav;
