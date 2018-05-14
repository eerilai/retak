import React, { Component } from "react";
import { Modal } from "reactstrap";
import axios from "axios";
import { Button, Icon, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, login } from "../../../actions/actions";

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: "",
      password: ""
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({
      usernameOrEmail: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { usernameOrEmail, password } = this.state;
    axios
      .post("/auth/login", {
        username: usernameOrEmail,
        password
      })
      .then(res => {
        this.props.toggleView("off");
        this.props.toggleLoginLogout(true);
        this.props.login(usernameOrEmail);
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === "login"}>
        <div className="log">
          <a href="/auth/google">
            <Button color="google plus">
              <Icon name="google plus" /> Sign in with Google
            </Button>
          </a>

          <form onSubmit={this.handleSubmit}>
            <div>
              <p className="logTag">Username</p>
              <Input className="hvr-shadow-radial" required>
                <input
                  type="text"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                />
              </Input>
            </div>
            <div>
              <p className="logTag">Password</p>
              <Input className="hvr-shadow-radial" required>
                <input
                  type="password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
              </Input>
            </div>

            <Button id="loginButton" size="large" animated>
              <Button.Content visible>Log In</Button.Content>
              <Button.Content hidden>
                <Icon size="large" name="user" />
              </Button.Content>
            </Button>
          </form>
          <p className="question">Here for the first time?</p>
          <Button
            color="blue"
            onClick={() => {
              this.props.toggleView("signup");
            }}
          >
            Click here to signup
          </Button>
          <Button
            color="blue"
            onClick={() => {
              this.props.toggleView("off");
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
