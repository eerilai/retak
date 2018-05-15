import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

import { Link, withRouter } from "react-router-dom";
import {
  Input,
  Button,
  Header,
  Modal,
  Icon,
  Form,
  Select,
  Transition,
  Popup,
  Image
} from "semantic-ui-react";
import "../../styles/livegame.css";

import Game from '../LiveGame/Game';
import Board from '../LiveGame/Board';
import Stack from '../LiveGame/Stack';
import LiveGame from'../LiveGame'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { toggleLoginLogout, login } from '../../../actions/actions';

class TiedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
    // this.handleOk = this.handleOk.bind(this);
    // this.handleCancel = this.handleCancel.bind(this);
  }
  render() {
    return (
      <Transition animation={"pulse"} duration={100} visible={true}>
        <Modal
          open={this.state.isOpen}
          size={"tiny"}
          onClose={() => this.setState({ isOpen: false })}
        >
          <Modal.Header>The Game has Ended</Modal.Header>
          <Modal.Content>
            <p>Board is Full<br/></p>
            <p>No winners it's a Tie!</p>
          </Modal.Content>
          <Modal.Actions>
            <Link to="/">
              <Button
                positive
                icon="checkmark"
                size="large"
                labelPosition="right"
                content="Close Game"
              />
            </Link>
          </Modal.Actions>
        </Modal>
      </Transition>
    );
  }
}

function mapStateToProps(state) {
  return;
  // return { 
  //   isLoggedIn: state.isLoggedIn,
  //   currentUser: state.currentUser
  // }
}

function mapDispatchToProps(dispatch) {
  return;
  // return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TiedModal);