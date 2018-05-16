import React, { Component } from "react";
import axios from "axios";
import SignupModal from "./AuthModals/SignupModal";
import LoginModal from "./AuthModals/LoginModal";
import LogoutModal from "./AuthModals/LogoutModal";

import { Dropdown, Icon, Image } from 'semantic-ui-react';
import ProfileModal from "./UserModals/ProfileModal";
import SettingsModal from "./UserModals/SettingsModal";
import HelpModal from "./UserModals/HelpModal";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, login } from "../../actions/actions";


class AuthNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: "off",
      open: false
    };
    this.changeView = this.changeView.bind(this);
  }

  componentDidMount() {
    axios
      .get("/auth/check")
      .then(res => {
        let currentUser = res.data;
        if (currentUser[0] !== "<") {
          this.props.toggleLoginLogout(true);
          this.props.login(currentUser);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  changeView(view) {
    this.setState({
      modalView: view
    });
  }

  onClose = () => { this.setState({open: false}) }
  
  handleChange = (e, { value }) => {
    console.log(e, value);
    if( value === 'profile'){
      console.log('Profile')
    }
    if( value === 'settings'){
      console.log('Settings')
    }
    if( value === 'help'){
      console.log('Help')
    }
    if(value === 'logout'){
      this.setState({modalView:'logout'});
    }
  }

  render() {
    // Conditionals need to be set in place for
    // rendering either login/signup nav or logout nav
    // - will need access to redux state once redux implemented
    const { modalView } = this.state;
    const { isLoggedIn, currentUser } = this.props;
    const { value } = this.state;

    const userNavLink = (
      <nav>
        <div id="user-nav">
          <Dropdown
            text={<span>
              <Icon name='user circle outline' /> Hello, {currentUser}
              {/* <Image avatar src={faker.internet.avatar()} /> {faker.name.findName()} */}
            </span>} 
            pointing='top left' 
            // icon={null}
          >
          <Dropdown.Menu>
            <Dropdown.Item value="profile" onClick={ this.handleChange }><Icon name='user circle outline' /> Profile </Dropdown.Item>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthNav);
