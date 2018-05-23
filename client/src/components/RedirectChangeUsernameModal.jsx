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
      username: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e, property) {
    const newState = {};
    newState[property] = e.target.value;
    this.setState(newState);
    console.log(this.state, 'target val', e.target.value)
  }

  render() {
    const { isLoggedIn, currentUsername, userEmail } = this.props;

    return (
      <Modal
        open={this.props.selectModal === 'createUsername'}
        size={"fullscreen"}
        dimmer={true}
        onClose={() => this.props.changeModalView('')}
        closeIcon
        >
        <Modal.Header>Choose Username</Modal.Header>
        <Modal.Content>
          <div>

          </div>
          <Modal.Description>
            <form onSubmit={this.handleSubmit} className="signupForm">
              <div>
                <div>
                  <p className="logTag">Username:</p>
                  <Input className="hvr-shadow-radial" required>
                    <div className="ui left icon input">
                      <i class="user icon"></i>
                      <input
                        type="text"
                        placeholder="Username"
                        defaultValue={currentUsername}
                        // value={this.state.username}
                        onChange={e => {
                          this.handleInputChange(e, "username");
                        }}
                      />
                    </div>
                  </Input>
                </div>
              </div>
            </form>
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