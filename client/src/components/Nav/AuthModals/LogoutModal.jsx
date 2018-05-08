import React from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoginLogout, login } from '../../../actions/actions';

const LogoutModal = (props) => {
  const logout = () => {
    axios.post('/auth/logout')
      .then(() => {
        props.toggleView('off');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const isOpen = props.modalView === 'logout';
  return (
    <Modal isOpen={isOpen}>
      <div>
        <p>Logout</p>
        <button onClick={logout}>Logout</button>
        <button onClick={() => { props.toggleView('off') }}>Cancel</button>  
      </div>
    </Modal>
  );
};

function mapStateToProps(state) {
  return { hasLoggedOut : state.state.hasLoggedOut }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutModal);