import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoginLogout, login } from '../../../actions/actions';

class LogoutModal extends Component {
  constructor(props) {
    super(props);
    this.state ={};
    this.handleLogout = this.handleLogout.bind(this);
  }
  
  handleLogout(){
    axios.post('/auth/logout')
    .then(() => {
      console.log('You have Logged Out')
      this.props.toggleView('off');
      this.props.toggleLoginLogout(false);
      this.props.login('guest');
    })
    .catch((err) => {
      console.error(err);
    });
  }
  
  render() {
    return (
      <Modal isOpen={this.props.modalView === 'logout'}>
        <div>
          <p>Are you sure you want to Logout?</p>
          <button onClick={this.handleLogout}>Logout</button>
          <button onClick={() => { props.toggleView('off') }}>Cancel</button>  
        </div>
      </Modal>
    )
  }

}

function mapStateToProps(state) {
  console.log('state in LogoutModal', state)
  return { 
    isLoggedIn: state.isLoggedIn,
    userLoggedIn: state.userLoggedIn
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutModal);
// export default LogoutModal;