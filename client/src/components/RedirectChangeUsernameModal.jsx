import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { Modal, Button, Icon, Input, Header, Form, Select } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, login } from "../actions/actions";

class RedirectCreateUsername extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e, { value }) {
    this.setState({
      username: value
    });
  }

  render() {
    const { isLoggedIn, currentUsername, userEmail } = this.props;
    const { username } = this.state;

    return (
      <Modal
        open={this.props.selectModal === 'createUsername'}
        size={"tiny"}
        dimmer={true}
        >
        <Modal.Header>Create a Username:</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
            <div className="ui left icon input">
              <Form.Input
                required
                type="text"
                className="hvr-shadow-radial"
                placeholder="username"
                value={this.state.username}
                onChange={this.handleInputChange}
              />
              </div>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button 
            primary 
            onClick={() => this.props.handleSubmit(username) }
          >
            Save <Icon name='right chevron' />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUsername: state.currentUsername,
    userEmail: state.userEmail
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RedirectCreateUsername);