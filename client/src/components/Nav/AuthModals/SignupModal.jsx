import React, { Component } from "react";
import { Modal } from "reactstrap";
import axios from "axios";
import { Button, Icon, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, login } from "../../../actions/actions";
class SignupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordRetype: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e, property) {
    const newState = {};
    newState[property] = e.target.value;
    this.setState(newState);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, email, password, passwordRetype } = this.state;
    if (password === passwordRetype) {
      axios
        .post("/auth/signup", {
          username,
          email,
          password
        })
        .then(res => {
          if (res.status === 200) {
            this.props.toggleView("off");
            this.props.toggleLoginLogout(true);
            this.props.login(username);
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      // TODO: Alert user passwords must match
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === "signup"}>
        <div className="log">
          <a href="/auth/google">
            <Button color="google plus">
              <Icon name="google plus" /> Sign up with Google
            </Button>
          </a>

          <form onSubmit={this.handleSubmit} className="signupForm">
            <div>
              <p className="logTag">Username</p>
              <Input className="hvr-shadow-radial" required>
                <input
                  type="text"
                  value={this.state.username}
                  onChange={e => {
                    this.handleInputChange(e, "username");
                  }}
                />
              </Input>
            </div>
            <div>
              <p className="logTag">Email</p>
              <Input className="hvr-shadow-radial" required>
                <input
                  type="email"
                  value={this.state.email}
                  onChange={e => {
                    this.handleInputChange(e, "email");
                  }}
                />
              </Input>
            </div>
            <div>
              <p className="logTag">Password</p>
              <Input className="hvr-shadow-radial" required>
                <input
                  type="password"
                  value={this.state.password}
                  onChange={e => {
                    this.handleInputChange(e, "password");
                  }}
                />
              </Input>
            </div>
            <div>
              <p className="logTag">Retype Password</p>
              <Input className="hvr-shadow-radial" required>
                <input
                  type="password"
                  value={this.state.passwordRetype}
                  onChange={e => {
                    this.handleInputChange(e, "passwordRetype");
                  }}
                />
              </Input>
            </div>
            <Button id="loginButton" size="large" animated>
              <Button.Content visible>Sign Up</Button.Content>
              <Button.Content hidden>
                <Icon size="large" name="user" />
              </Button.Content>
            </Button>
          </form>
          <p className="question">Already have an account?</p>
          <Button
            color="blue"
            onClick={() => {
              this.props.toggleView("login");
            }}
          >
            Click here to login
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupModal);
