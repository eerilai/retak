import React from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

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

export default LogoutModal