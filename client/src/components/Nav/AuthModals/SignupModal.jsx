import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

class SignupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordRetype: ''
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
      axios.post('/auth/signup', {
        username, email, password
      })
      .then((res) => {
        // TODO: Not sure if anything should go here
      });
    } else {
      console.log('both password fields must match');
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === 'signup'}>
        <div>
          <a href="/auth/google">
            <button>Sign up with Google</button>
          </a>
          <p>Signup</p>
          <form onSubmit={this.handleSubmit}>
            <div>
              <p>Username</p>
              <input type="text" value={this.state.username} onChange={(e) => {this.handleInputChange(e, 'username')}} />
            </div>
            <div>
              <p>Email</p>              
              <input type="text" value={this.state.email} onChange={(e) => {this.handleInputChange(e, 'email')}} />
            </div>
            <div>
              <p>Password</p>              
              <input type="text" value={this.state.password} onChange={(e) => {this.handleInputChange(e, 'password')}} />
            </div>
            <div>
              <p>Retype Password</p>              
              <input type="text" value={this.state.passwordRetype} onChange={(e) => {this.handleInputChange(e, 'passwordRetype')}} />
            </div>
            <div>
              <button>
                <input type="submit" value="Signup" />
              </button>
            </div>
          </form>
          <p>Already have an account?</p>
          <button onClick={() => { this.props.toggleView('login') }}>Click here to login</button>
          <button onClick={() => { this.props.toggleView('off') }}>Cancel</button>          
        </div>
      </Modal>
    );
  }
}

export default SignupModal