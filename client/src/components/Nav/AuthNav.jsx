import React, { Component } from "react";
import SignupModal from "./AuthModals/SignupModal";
import LoginModal from "./AuthModals/LoginModal";
import LogoutModal from "./AuthModals/LogoutModal";

import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, login } from "../../actions/actions";

class AuthNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalView: "off"
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

  render() {
    // Conditionals need to be set in place for
    // rendering either login/signup nav or logout nav
    // - will need access to redux state once redux implemented
    const { modalView } = this.state;
    const { isLoggedIn } = this.props;
    const userNavLink = (
      <nav
        className="hvr-grow-shadow"
        onClick={() => {
          this.changeView("logout");
        }}
      >
        Logout
      </nav>
    );

    const guestNavLink = (
      <div className="hvr-grow-shadow">
        <nav
          onClick={() => {
            this.changeView("login");
          }}
        >
          Login
        </nav>
      </div>
    );

    return (
      <div>
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
