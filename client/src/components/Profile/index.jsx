import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import axios from 'axios';
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { userInfo } from 'os';
import UserHistory from './UserHistory';
import PageNotFound from '../PageNotFound';
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      userHistory: [],
      userInfo: {},
      isUser: false
    }

    this.getUserHistory();
    this.getUserInfo();

    // axios.post('/users/:username/data', {
    //   imageName: 'cat',
    //   imageFile: cat
    // })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   })

    axios.get('/users/:username/data',

    )
      .then(function (response) {
        console.log('hellp', response);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  getUserHistory() {
    const { userName } = this.props.match.params;
    axios.get(`/users/${userName}/games`)
      .then((userGameHistory) => {
        if (userGameHistory.data !== null) {
          this.setState({ isUser: true });
          this.setState({ userHistory: userGameHistory.data });
        }
      })
      .catch(err => console.error(err));
  }

  getUserInfo() {
    const { userName } = this.props.match.params;
    axios.get(`/users/${userName}/data`)
      .then((userInfo) => {
        if (userInfo.data !== null) {
          this.setState({ isUser: true });
          this.setState({ userInfo: userInfo.data });
        }
      })
      .catch(err => console.error(err));
  }





  render() {
    const { isLoggedIn, currentUser, userID } = this.props;
    const { userName } = this.props.match.params;

    const userProfile = (
      <div>
        <UserHistory userHistory={this.state.userHistory} />
      </div>
    );

    const notFoundPage = (
      <PageNotFound />
    );

    return (
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