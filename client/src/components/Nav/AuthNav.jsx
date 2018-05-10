import React, { Component } from 'react';
import SignupModal from './AuthModals/SignupModal';
import LoginModal from './AuthModals/LoginModal';
import LogoutModal from './AuthModals/LogoutModal';

import { connect } from 'react-redux';

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
    const { isLoggedIn } = this.props;
    console.log('AuthNav isLoggedIn is', isLoggedIn)

    const userNavLink = (
        <nav onClick={() => {this.changeView('logout')}}>(Logout)</nav>
    );

    const guestNavLink = (
      <div>
        <nav onClick={() => {this.changeView('login')}}>(Login)</nav>
        <nav onClick={() => {this.changeView('signup')}}>(Signup)</nav>
      </div>
    );
      
      return (
        <div>
        { isLoggedIn ? userNavLink : guestNavLink }
        <SignupModal toggleView={this.changeView} modalView={modalView} />
        <LoginModal toggleView={this.changeView} modalView={modalView} />
        <LogoutModal toggleView={this.changeView} modalView={modalView} />
      </div>
    );
  }
};

// AuthNav.propTypes = {
//   isLoggedIn: React.propTypes.object.isRequiered
// }

function mapStateToProps(state) {
  console.log('AuthNav state.isLoggedIn', state.isLoggedIn)
  return { isLoggedIn: state.isLoggedIn }
}

export default connect(mapStateToProps)(AuthNav);