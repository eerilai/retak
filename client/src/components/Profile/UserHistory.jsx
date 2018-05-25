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
        } else {
          this.setState({ isUser: false });
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
        } else {
          this.setState({ isUser: false });
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

      const time = moment(user.createdAt).format('MMMM Do YYYY, h:mm a');
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

        const victorPlayer1 = (
          <div>
              <strong
                className="lablePlayer1" 
                onClick={() => {this.changeHistory(user.player1, player1UserProfile)}}
                style={{cursor:  'pointer'}}
              > 
              <Icon name='trophy'/>
              {user.player1} 
              </strong>
              <strong>  VS </strong> 
              <strong 
                className="lablePlayer2" 
                onClick={() => {this.changeHistory(user.player2, player2UserProfile)}}
                style={{'cursor':  'pointer'}}
              >  
              {user.player2} 
              </strong>
            </div>
        )

        const victorPlayer2 = (
          <div>
              <strong
                className="lablePlayer1" 
                onClick={() => {this.changeHistory(user.player1, player1UserProfile)}}
                style={{cursor:  'pointer'}}
              > 
              {user.player1} 
              </strong>
              <strong>  VS </strong> 
              <strong 
                className="lablePlayer2" 
                onClick={() => {this.changeHistory(user.player2, player2UserProfile)}}
                style={{cursor:  'pointer'}}
              >  
              {user.player2}
              <Icon name='trophy'/> 
              </strong>
            </div>
        )

      return (
        <div>
          <div key={user.id} className="eachGame">
            <div className="playedOnHist"><strong className="lable">Date:</strong> {time}</div>
            <div className="vsHist"> 
              {(user.victor === user.player1) ? victorPlayer1 : victorPlayer2}
            </div>
            <div className="winTypeHist"><strong className="lable">Type:</strong> {typeOfWin}</div>
            <div className="boardSizeHist"><strong className="lable">Board Size:</strong> {user.board_size} x {user.board_size}</div>
            <div className="ptnHist"><strong className="lable">PTN: </strong> {user.ptn}</div>
            {/* <CopyToClipboard
                text={user.ptn}
                onCopy={() => this.setState({ copied: true })}
              >
              <span>
                <Icon name="copy" size="large" />
              </span>
            </CopyToClipboard>
            <div id="copied">
              {this.state.copied ? 'PTN Copied' : ''}
            </div> */}
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
            <div className="totalGames">
              <strong> Total Games: </strong>
              <span> {userInfo.total_games} </span>
            </div>
            <div className="totalRGames"> 
              <strong> Total Ranked Games: </strong>
              <span>{userInfo.ranked_games}</span>
            </div>
            <div className="rankedWins">
              <strong> Ranked Wins: </strong>
              <span>{userInfo.ranked_wins}</span>
            </div>
            <div className="rankedLosses">
              <strong> Ranked Losses: </strong>
              <span>{userInfo.ranked_losses}</span>
            </div>
          </table>
          </div>
        <table class="tg">
         <thead>
            <tr>
              <th colSpan="5" className="title">
                <h3>Game History</h3>
              </th>
            </tr>
            {/* <tr>
              <th className="col-room">Date</th>
              <th className="col-players">Players</th>
              <th className="col-board">Board</th>
              <th className="col-time">Victor</th>
              <th className="col-winType">Type</th>
            </tr> */}
          </thead>
          {(this.state.userHistory.length) ? eachUserGame : noHistory}
        </table>
      </div>
    );
  }
}

export default withRouter(UserHistory);