import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import axios from 'axios';
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { userInfo } from 'os';
import UserInfo from './UserInfo';
import UserHistory from './UserHistory';
import PageNotFound from '../PageNotFound';

class Profile extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      activeItem: 'stats',
      userHistory: [],
      userInfo: {},
      isUser: false
    }
    this.getUserHistory();
    this.getUserInfo();
  }

  getUserHistory() {
    const { userName } = this.props.match.params;
    axios.get(`/users/${userName}/games`)
      .then((userGameHistory) => {
        if( userGameHistory.data !== null) {
          this.setState({isUser: true});
          this.setState({userHistory: userGameHistory.data});
        }
      })
      .catch( err => console.error(err));
  }

  getUserInfo() {
    const { userName } = this.props.match.params;
    axios.get(`/users/${userName}/data`)
      .then((userInfo) => {
        if( userInfo.data !== null) {
          this.setState({isUser: true});
          this.setState({userInfo: userInfo.data});
        }
      })
      .catch( err => console.error(err));
  }
  
  render() {
    const { activeItem } = this.state;
    const { isLoggedIn, currentUser, userID } = this.props;
    const { userName } = this.props.match.params;

    const userProfile = (
      <div>
        <h4>{userName}'s Profile</h4>
        <UserInfo userInfo={this.state.userInfo} />
        <UserHistory userHistory={this.state.userHistory} />
      </div>
    );

    const notFoundPage = (
      <PageNotFound />
    );

    return(
      <div className="takless">
        <div className="main">
          {this.state.isUser ? userProfile : notFoundPage}
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