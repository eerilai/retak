import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import axios from 'axios';
import { Form, Button, Header, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoginLogout, login } from '../../../actions/actions';

class SignupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: false,
      usernameError: false,
      emailError: false,
      passwordError: false,
      confirmPasswordError: false,
      errorMessages: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e, property) {
    const newState = {};
    newState[property] = e.target.value;
    this.setState(newState);
  }

  checkForm() {
    const newState = this.state;
    newState.errorMessages = [];
    if (this.state.password.length < 8) {
      newState.passwordError = true;
      newState.errorMessages.push('Password must be at least 8 characters long');
    }
    if (this.state.password !== this.state.confirmPassword) {
      newState.passwordError = true;
      newState.confirmPasswordError = true;
      newState.errorMessages.push('Passwords do not match');
    }
    const endsWithAlphanumeric = RegExp(/[A-Za-z0-9]$/);
    if (!endsWithAlphanumeric.test(this.state.username)) {
      newState.usernameError = true;
      newState.errorMessages.push('Username must end with a letter or a number');
    }
    const onlyContainsAlphanumAndDashes = RegExp(/[\w|-]*/);
    if (!onlyContainsAlphanumAndDashes.test(this.state.username)) {
      newState.usernameError = true;
      newState.errorMessages.push('Username must only contain alphanumeric characters, dashes, or underscores');
    }
    if (this.state.username.length < 2) {
      newState.usernameError = true;
      newState.errorMessages.push('Username must be at least 2 characters long');
    }
    if (newState.usernameError
      || newState.emailError
      || newState.passwordError
      || newState.confirmPasswordError) {
      newState.error = true;
    }
    this.setState(newState);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, email, password } = this.state;
    this.checkForm();
    if (!this.state.error) {
      axios
        .post('/auth/signup', {
          username,
          email,
          password,
        })
        .then((res) => {
          const currentUserInfo = res.data;
          const { currentUsername } = res.data;
          if (res.status === 200) {
            this.props.toggleView('off');
            this.props.toggleLoginLogout(true);
            this.props.login(currentUserInfo);
            this.props.socket.emit('login', currentUsername);
          } else {
            const { errorMessages } = this.state;
            errorMessages.push('Unable to create account. Please try again.');
            this.setState({
              error: true,
              errorMessages,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === 'signup'}>
        <div className="log">
          <Header content="Sign Up" />
          {/*
          <a href="/auth/google">
            <Button circular className="ui google plus button" role="button" color="google plus">
              <i aria-hidden="true" className="google plus icon"></i>
              |   Google
            </Button>
          </a>
          <a href="/auth/facebook">
            <Button circular className="ui facebook button" role="button" color="facebook">
              <i aria-hidden="true" className="facebook icon"></i>
              |  Facebook
            </Button>
          </a>
          */}
          <Form error={this.state.error} onSubmit={this.handleSubmit} className="signupForm">
            <Message error size="tiny">
              <Message.Header>Please check the following and try again</Message.Header>
              <ul>{this.state.errorMessages.map(error => <li>{error}</li>)}</ul>
            </Message>
            <div>
              <div>
                <p className="logTag">Username:</p>
                <Form.Input error={this.state.usernameError} className="hvr-shadow-radial" required>
                  <div className="ui left icon input">
                    <i className="user icon" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={this.state.username}
                      onChange={(e) => {
                        this.handleInputChange(e, 'username');
                      }}
                    />
                  </div>
                </Form.Input>
              </div>
              <div>
                <p className="logTag">Email:</p>
                <Form.Input error={this.state.emailError} className="hvr-shadow-radial" required>
                  <div className="ui left icon input">
                    <i className="mail icon" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={(e) => {
                        this.handleInputChange(e, 'email');
                      }}
                    />
                  </div>
                </Form.Input>
              </div>
              <div>
                <p className="logTag">Password:</p>
                <Form.Input error={this.state.passwordError} className="hvr-shadow-radial" required>
                  <div className="ui left icon input">
                    <i className="lock icon" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={(e) => {
                        this.handleInputChange(e, 'password');
                      }}
                    />
                  </div>
                </Form.Input>
              </div>
              <div>
                <p className="logTag">Retype Password:</p>
                <Form.Input error={this.state.confirmPasswordError} className="hvr-shadow-radial" required>
                  <div className="ui left icon input">
                    <i className="lock icon" />
                    <input
                      type="password"
                      placeholder="Re-Type Password"
                      value={this.state.confirmPassword}
                      onChange={(e) => {
                        this.handleInputChange(e, 'confirmPassword');
                      }}
                    />
                  </div>
                </Form.Input>
              </div>
            </div>
            <Button
              id="signupButton"
              size="large"
              color="green"
              disabled={
                !this.state.username
                || !this.state.email
                || !this.state.password
                || !this.state.confirmPassword
              }
            >
              Sign Up
            </Button>
          </Form>
          <p className="question">Already have an account?</p>
          <Button
            color="blue"
            onClick={() => {
              this.props.toggleView('login');
            }}
          >
            Click here to Login
          </Button>
          <Button
            color="red"
            onClick={() => {
              this.props.toggleView('off');
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }
}

SignupModal.propTypes = {
  toggleView: PropTypes.func.isRequired,
  toggleLoginLogout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  modalView: PropTypes.string.isRequired,
  socket: PropTypes.any.isRequired,
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUsername: state.currentUsername,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupModal);
