import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoginLogout, login } from '../../../actions/actions';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: '',
      password: ''
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
    axios.post('/auth/login', {
      username: usernameOrEmail,
      password
    })
    .then((res) => {
      this.props.toggleView('off');
      this.props.toggleLoginLogout(true);
      this.props.login(usernameOrEmail);
    })
    .catch((err) => {
      console.error(err)
    })

  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === 'login'}>
        <div>
          <a href="/auth/google">
            <button>Sign in with Google</button>
          </a>
          <p>Login</p>
          <form onSubmit={this.handleSubmit}>
            <div>
              <p>Username</p>
              <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
            </div>
            <div>
              <p>Password</p>
              <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
            </div>
            <div>
              <button>
                <input type="submit" value="Login" />
              </button>
            </div>
          </form>
          <p>Here for the first time?</p>
          <button onClick={() => { this.props.toggleView('signup') }}>Click here to signup</button>
          <button onClick={() => { this.props.toggleView('off') }}>Cancel</button>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return { 
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);