import React from 'react';
import { Modal } from 'reactstrap';

const SignupModal = (props) => {
  const isOpen = props.modalView === 'signup'
  return (
    <Modal isOpen={isOpen}>
      <div>
        Signup Modal Test
      </div>
    </Modal>
  );
};

export default SignupModal