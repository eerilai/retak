import React, { Component } from 'react';
import SignupModal from './AuthModals/SignupModal';
import LoginModal from './AuthModals/LoginModal';
import LogoutModal from './AuthModals/LogoutModal';

class AuthNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: '',
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView(view) {
    this.setState({
      modalView: view
    });
  }

  render() {
    // TODO: Conditional need to be set in place for
    // rendering either login/signup nav or logout
      // - will need access to redux state once redux implemented
      // - will pass local state to individual modals
    const { modalView } = this.state;
    return (
      <div>
        <nav onClick={() => {this.changeView('login')}}>(Login/Signup)</nav>
        <SignupModal modalView={modalView} />
        <LoginModal modalView={modalView} />
        <LogoutModal modalView={modalView} />
      </div>
    );
  }
};

export default AuthNav;