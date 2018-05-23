import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { Icon, Image } from 'semantic-ui-react';
import axios from 'axios';
import { CopyToClipboard } from "react-copy-to-clipboard";

class UserHistory extends Component {
  constructor(props){
    super(props);
    this.state= {
      userHistory: [],
      userInfo: {},
      copied: false,
    }
  }

  componentWillMount(){
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

  changeHistory = (user, userURL) => {
    axios.get(`/users/${user}/data`)
      .then((userInfo) => {
        if( userInfo.data !== null) {
          axios.get(`/users/${user}/games`)
          .then((userGameHistory) => {
            if( userGameHistory.data !== null) {
              this.setState({
                userInfo: userInfo.data,
                userHistory: userGameHistory.data,
              });
            }
            this.props.history.push(userURL)
          })
        }
      })
      .catch(err => console.error(err) );
  }

  render() {
    let userInfo = this.state.userInfo;
    const eachUserGame = this.state.userHistory.map((user) => {

      const time = moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a');
      const player1UserProfile = `/profile/${user.player1}`;
      const player2UserProfile = `/profile/${user.player2}`;
  
      let typeOfWin = '';
      if (user.win_type === 'R') {
        typeOfWin = 'Road Win';
      } 
      else if (user.win_type === 'F') {
        typeOfWin = 'Flat Win'
      }
      else if (user.win_type === 'T') {
        typeOfWin = 'Time Ran Out Win'
      }
      else if (user.win_type === '1') {
        typeOfWin = 'Rsignation Win'
      }
      else if (user.win_type === '1/2') {
        typeOfWin = 'Draw'
      }
      return (
        <div>
          <div key={user.id} className="eachGame">
            <div>Played On: {time}</div>
            <div>
              <strong onClick={() => {this.changeHistory(user.player1, player1UserProfile)}}> {user.player1} </strong>
                VS  
              <strong onClick={() => {this.changeHistory(user.player2, player2UserProfile)}}>  {user.player2} </strong>
            </div>
            <div>Victor: {user.victor}</div>
            <div>{typeOfWin}</div>
            <div>Board Size: {user.board_size}</div>
            <div><strong>PTN: </strong> {user.ptn}</div>
            {/* <CopyToClipboard
                text={user.ptn}
                onCopy={() => this.setState({ copied: true })}
              >
              <span>
                <Icon name="copy" size="large" />
              </span>
            </CopyToClipboard> */}
            <div id="copied">
              {this.state.copied ? 'PTN Copied' : ''}
            </div>
          </div>
        </div>
      );
    });
  
    const noHistory = (
      <div>You haven't played a game yet...</div>
    );
  
    return (
      <div className="userHistory"> 
        <div className="userInfo">
        <table class="tg">
         <thead>
            <th colSpan="5" className="title">
              <h3>{userInfo.username}'s Profile</h3>
            </th>
          </thead>
            {/* <img /> */}
            {/* <div> 
              <span> Username: </span> 
              <span>{userInfo.username}</span> 
            </div> */}
            <div>
              <span> Total Games: </span>
              <span> {userInfo.total_games} </span>
            </div>
            <div> 
              <span> Total Ranked Games: </span>
              <span>{userInfo.ranked_games}</span>
            </div>
            <div>
              <span> Ranked Wins: </span>
              <span>{userInfo.ranked_wins}</span>
            </div>
            <div>
              <span> Ranked Losses: </span>
              <span>{userInfo.ranked_losses}</span>
            </div>
          </table>
          </div>
        <table class="tg">
         <thead>
            <th colSpan="5" className="title">
              <h3>Game History</h3>
            </th>
          </thead>
          {(this.state.userHistory.length) ? eachUserGame : noHistory}
        </table>
      </div>
    );
  }
}

export default withRouter(UserHistory);