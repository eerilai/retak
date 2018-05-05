import React, { Component } from 'react';
import SignupModal from './AuthModals/SignupModal';
import LoginModal from './AuthModals/LoginModal';
import LogoutModal from './AuthModals/LogoutModal';

class AuthNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: 'off',
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView(view) {
    this.setState({
      modalView: view
    });
  }

  render() {
    // TODO: Conditionals need to be set in place for
    // rendering either login/signup nav or logout nav
      // - will need access to redux state once redux implemented
    const { modalView } = this.state;
    return (
      <div>
        <nav onClick={() => {this.changeView('login')}}>(Login/Signup)</nav>
        <nav onClick={() => {this.changeView('logout')}}>(Logout)</nav>
        <SignupModal toggleView={this.changeView} modalView={modalView} />
        <LoginModal toggleView={this.changeView} modalView={modalView} />
        <LogoutModal toggleView={this.changeView} modalView={modalView} />
      </div>
    );
  }
};

export default AuthNav;