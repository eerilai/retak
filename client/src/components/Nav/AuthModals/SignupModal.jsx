import React, { Component } from "react";
import { Modal } from "reactstrap";
import axios from "axios";
import { Button, Icon, Input, Header } from "semantic-ui-react";
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
          let currentUserInfo = res.data;
          let currentUser = res.data.currentUser;
          if (res.status === 200) {
            this.props.toggleView("off");
            this.props.toggleLoginLogout(true);
            this.props.login(currentUserInfo);
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
          <Header icon='SignUp' content='Sign Up' />
          <a href="/auth/google">
            <Button class="ui google plus button" role="button" color="red">
              <i aria-hidden="true" class="google plus icon"></i>
              |   Sign up with Google
            </Button>
          </a>

          <form onSubmit={this.handleSubmit} className="signupForm">
            <div>
              <div>
                <p className="logTag">Username:</p>
                <Input className="hvr-shadow-radial" required>
                  <div className="ui left icon input">
                    <i class="user icon"></i>
                    <input
                      type="text"
                      placeholder="Username"
                      value={this.state.username}
                      onChange={e => {
                        this.handleInputChange(e, "username");
                      }}
                    />
                  </div>
                </Input>
              </div>
              <div>
                <p className="logTag">Email:</p>
                <Input className="hvr-shadow-radial" required>
                  <div className="ui left icon input">
                    <i class="user icon"></i>
                    <input
                      type="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={e => {
                        this.handleInputChange(e, "email");
                      }}
                    />
                  </div>
                </Input>
              </div>
              <div>
                <p className="logTag">Password:</p>
                <Input className="hvr-shadow-radial" required>
                  <div class="ui left icon input">
                    <i class="lock icon"></i>
                    <input
                      type="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={e => {
                        this.handleInputChange(e, "password");
                      }}
                    />
                  </div>
                </Input>
              </div>
              <div>
                <p className="logTag">Retype Password:</p>
                <Input className="hvr-shadow-radial" required>
                  <div class="ui left icon input">
                    <i class="lock icon"></i>
                    <input
                      type="password"
                      placeholder="Re-Type Password"
                      value={this.state.passwordRetype}
                      onChange={e => {
                        this.handleInputChange(e, "passwordRetype");
                      }}
                    />
                  </div>
                </Input>
              </div>
            </div>
            <Button id="signupButton" size="large" color="#4cc560">Sign Up  <Icon size="large" name="add user" corner="true"/></Button>
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
