import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import axios from 'axios';
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { userInfo } from 'os';
import UserInfo from './UserInfo';
import UserHistory from './UserHistory';

class Profile extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      activeItem: 'stats',
      userHistory: []
    }
    this.getUserHistory();
  }
  
  getUserHistory() {
    const { userName } = this.props.match.params;
    axios.get(`/users/${userName}/games`)
      .then((userGameHistory) => {
        console.log( userGameHistory.data)
        this.setState({userHistory: userGameHistory.data})
      })
      .catch( err => console.error(err));
  }
  
  render() {
    const { activeItem } = this.state
    const { isLoggedIn, currentUser, userID } = this.props;
    const { userName } = this.props.match.params;

    return(
      <div className="takless">
        <div className="main">
            <h4>{userName} Profile</h4>
            <div className="lobby">
              <UserInfo/>
            </div>
            <UserHistory userHistory={this.state.userHistory} />
        </div>
      </div>
    );
  }

}


function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser,
    userID: state.userID
  };
}

export default withRouter(connect(mapStateToProps)(Profile));