import React, { Component } from 'react';
import { Input, Button, Header, Modal, Icon, Form, Select, Image } from 'semantic-ui-react';
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, login } from "../../../actions/actions";

class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleOnSave = this.handleOnSave.bind(this);
  }

  handleOnSave(e){
    console.log('P.props', this.props)
    console.log(e)
    this.props.changeModalView('')
  }

  render() {
      return (
        <Modal
        open={this.props.selectModal === 'profile'}
        size={"fullscreen"}
        dimmer={true}
        onClose={() => this.props.changeModalView('')}
        closeIcon
        >
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
          {/* <Image wrapped size='medium' src='/assets/images/avatar/large/rachel.png' /> */}
          <Modal.Description>
            <Header>Default Profile Image</Header>
            <p>We've found the following gravatar image associated with your e-mail address.</p>
            <p>Is it okay to use this photo?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button 
            primary 
            icon='right chevron' 
            onClick={(e) => this.handleOnSave(e)}
          >
            Save <Icon name='right chevron' />
          </Button>
        </Modal.Actions>
      </Modal>
    )
  } 
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileModal);