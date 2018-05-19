import React, { Component } from "react";
import SignupModal from "./AuthModals/SignupModal";
import LoginModal from "./AuthModals/LoginModal";
import LogoutModal from "./AuthModals/LogoutModal";

import { Dropdown, Icon, Image } from 'semantic-ui-react';
import ProfileModal from './UserModals/ProfileModal';
import SettingsModal from './UserModals/SettingsModal';
import HelpModal from './UserModals/HelpModal';
// import defaultAvatar from "./UserModals/defultAvatar.png";
import Profile from './../Profile';

import { connect } from "react-redux";
import { Link } from "react-router-dom";


class AuthNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: "off",
      open: false,
      selectModal: ''
    };
    this.changeView = this.changeView.bind(this);
    this.changeModalView = this.changeModalView.bind(this);
  }

  changeView(view) {
    this.setState({
      modalView: view
    });
  }

  changeModalView(view) {
    this.setState({ 
      selectModal : view 
    });
  }

  onClose = () => { this.setState({open: false}) }
  
  handleChange = (e, { value }) => {
    console.log(e, value);
    if( value === 'Profile'){
        // TODO
    } else if(value === 'logout'){
      this.setState({modalView: value});
    } else {
      this.setState({selectModal: value})
    }
    
  }

  render() {
    const { modalView, selectModal } = this.state;
    const { isLoggedIn, currentUser, userID } = this.props;
    const { value } = this.state;
    // const avatarImg = defaultAvatar;
    let userProfile = `/profile/${currentUser}`;

    const userNavLink = (
      <nav>
        <div id="user-nav">
          <Dropdown
            text={<span>
              {/* <Image avatar src={avatarImg} /> Hello, {currentUser} */}
              <Icon name='user circle outline' /> Hello, {currentUser}
              {/* <Image avatar src={faker.internet.avatar()} /> Hello, {currentUser} */}              
            </span>} 
            pointing='top left' 
            // icon={null}
          >
          <Dropdown.Menu>
            <Dropdown.Item value="Profile" onClick={ this.handleChange }>
              <Icon name='user circle outline' /> 
              <Link to={userProfile}> Profile </Link>
            </Dropdown.Item>
            <Dropdown.Item value="updateProfile" onClick={ this.handleChange }><Icon name='user circle outline' /> Update Profile </Dropdown.Item>
            <Dropdown.Item value="settings" onClick={ this.handleChange }><Icon name='settings' />Settings</Dropdown.Item>
            <Dropdown.Item value="help" onClick={ this.handleChange }><Icon name='help' />Help</Dropdown.Item>
            <Dropdown.Item value="logout" onClick={ this.handleChange }>Log Out <Icon name='sign out' /></Dropdown.Item>
          </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>
    );

    const guestNavLink = (
      <nav
        onClick={() => {
          this.changeView("login");
        }}
      >
        LogIn / SignUp
      </nav>
    );

    return (
      <div id="user-nav">
        {isLoggedIn ? userNavLink : guestNavLink}
        <SignupModal toggleView={this.changeView} modalView={modalView} />
        <LoginModal toggleView={this.changeView} modalView={modalView} />
        <LogoutModal toggleView={this.changeView} modalView={modalView} />
        <ProfileModal selectModal={this.state.selectModal} changeModalView={this.changeModalView} handleChange={this.handleChange} />
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

export default connect(mapStateToProps)(AuthNav);
