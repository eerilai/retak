import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';
import ReactDOM from 'react-dom';

class Modal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

  //   if (typeof window !== 'undefined') {
  //     return (
  //       ReactDOM.createPortal(
  //         (
  //           <div className="my-modal">
  //             Help
  //           </div>
  //         ),
  //         document.getElementById('page'),
  //       )
  //     );
  //   }
    return null;
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default Modal;
