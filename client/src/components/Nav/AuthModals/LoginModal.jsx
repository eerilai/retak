import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { Form, Button, Icon, Header, Message } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { toggleLoginLogout, login, setCorrGames } from '../../../actions/actions';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: '',
      password: '',
      error: false,
      errorMessage: '',
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({
      usernameOrEmail: e.target.value,
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { usernameOrEmail, password } = this.state;
    let error = false;
    let errorMessage = '';
    axios
      .post('/auth/login', {
        username: usernameOrEmail,
        password,
      })
      .then((res) => {
        const currentUserInfo = res.data;
        const { currentUsername } = res.data;
        this.props.toggleView('off');
        this.props.toggleLoginLogout(true);
        this.props.login(currentUserInfo);
        this.fetchGames();
        this.props.socket.emit('login', currentUsername);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 500) {
            error = true;
            errorMessage = 'Invalid username or password.';
          }
        } else {
          console.error(err);
          error = true;
          errorMessage = 'Unable to login to account. Please try again.';
        }
      })
      .finally(() => {
        this.setState({ error, errorMessage });
      });
  }

  fetchGames() {
    const { userID } = this.props;
    axios.get(`/users/${userID}/games/current`)
      .then((games) => {
        this.props.setCorrGames(games.data);
      });
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === 'login'}>
        <div className="log">
          <Header content="Login" />
          {/*
          <a href="/auth/google">
            <Button circular class="ui google plus button" role="button" color="google plus">
              <i aria-hidden="true" class="google plus icon"></i>
              | Google
            </Button>
          </a>
          <a href="/auth/facebook">
            <Button circular class="ui facebook button" role="button" color="facebook">
              <i aria-hidden="true" class="facebook icon"></i>
              |  Facebook
            </Button>
          </a>
          */}
          <Form error={this.state.error} onSubmit={this.handleSubmit}>
            <Message error size="tiny">
              {this.state.errorMessage}
            </Message>
            <div>
              <Form.Field>
                <label className="auth-form-label" htmlFor="usernameInput">Username</label>
                <div className="ui left icon input">
                  <i className="user icon" />
                  <input
                    type="text"
                    id="usernameInput"
                    value={this.state.username}
                    onChange={this.handleUsernameChange}
                  />
                </div>
              </Form.Field>
            </div>
            <div>
              <Form.Field>
                <label className="auth-form-label" htmlFor="passwordInput">Password</label>
                <div className="ui left icon input">
                  <i className="lock icon" />
                  <input
                    type="password"
                    id="passwordInput"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                  />
                </div>
              </Form.Field>
            </div>
            <div className="auth-modal-form-controls">
              <Button
                id="loginButton"
                type="submit"
                color="green"
                size="large"
                disabled={
                  !this.state.usernameOrEmail
                  || !this.state.password
                }
              >
                  Log In
                <Icon size="small" name="sign in" />
              </Button>
              <Button
                id="cancelAuthButton"
                type="button"
                color="red"
                onClick={() => {
                  this.props.toggleView('off');
                }}
              >
                <Icon style={{ margin: 'auto' }} name="ban" />
              </Button>
            </div>
          </Form>
          <p className="question">Here for the first time?</p>
          <Button
            id="switch-auth-modal-button"
            color="blue"
            onClick={() => {
              this.props.toggleView('signup');
            }}
          >
            Click here to Signup
          </Button>
        </div>
      </Modal>
    );
  }
}

LoginModal.propTypes = {
  toggleView: PropTypes.func.isRequired,
  toggleLoginLogout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  modalView: PropTypes.string.isRequired,
  socket: PropTypes.any.isRequired,
  setCorrGames: PropTypes.func.isRequired,
  userID: PropTypes.number,
};

LoginModal.defaultProps = {
  userID: null,
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    userID: state.userID,
    currentUsername: state.currentUsername,
    socket: state.socket,
    games: state.games,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login, setCorrGames }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
