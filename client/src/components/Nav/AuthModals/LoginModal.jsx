import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: ''
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleSubmit() {
    console.log('handleSubmit fired');
    const { username, password } = this.state;
    axios.post('/auth/login', {
      username, password
    });
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === 'login'}>
        <div>
          <p>Login</p>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
            <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
            <input type="submit" value="Login" />
          </form>
        </div>
      </Modal>
    );
  }
}

export default LoginModal