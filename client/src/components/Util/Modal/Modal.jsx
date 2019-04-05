import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Modal.scss';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.portal = null;
  }

  componentDidMount() {
    this.portal =
      ReactDOM.createPortal(
        (
          <div className="my-modal">
            {this.props.children}
          </div>
        ),
        document.getElementById(this.props.mountTo),
      );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.props.setView('');
      }
    });
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }
    if (typeof window !== 'undefined') {
      return this.portal;
    }
    return null;
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setView: PropTypes.func.isRequired,
  mountTo: PropTypes.string,
  children: PropTypes.array,
};

Modal.defaultProps = {
  children: null,
  mountTo: 'page',
};

export default Modal;
