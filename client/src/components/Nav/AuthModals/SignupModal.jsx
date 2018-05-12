import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

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
        if (res.status === 200) {
          this.props.toggleView('off');
          this.props.toggleLoginLogout(true);
          this.props.login(username);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    } else {
      // TODO: Alert user passwords must match
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
              <input type="email" value={this.state.email} onChange={(e) => {this.handleInputChange(e, 'email')}} />
            </div>
            <div>
              <p>Password</p>
              <input type="password" value={this.state.password} onChange={(e) => {this.handleInputChange(e, 'password')}} />
            </div>
            <div>
              <p>Retype Password</p>         
              <input type="password" value={this.state.passwordRetype} onChange={(e) => {this.handleInputChange(e, 'passwordRetype')}} />
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

function mapStateToProps(state) {
  return { 
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupModal);