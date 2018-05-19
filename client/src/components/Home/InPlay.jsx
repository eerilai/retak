import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class InPlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
    }
    this.fetchGames();
  }

  fetchGames() {
    axios.get(`/users/${this.props.userID}/games/current`);
  }

  render() {
    console.log(this.props.userID);
    return (
      <div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.userID,
  };
};

export default connect(mapStateToProps)(InPlay);
