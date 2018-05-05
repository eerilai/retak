import React from 'react';
import { Modal } from 'reactstrap';

const LogoutModal = (props) => {
  const isOpen = props.modalView === 'logout'  
  return (
    <Modal isOpen={isOpen}>
      <div>
        Logout Modal Test
      </div>
    </Modal>
  );
};

export default LogoutModal