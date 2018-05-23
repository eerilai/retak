import React, { Component } from "react";
import { Modal } from "reactstrap";
import axios from "axios";
import { Button, Icon, Input, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, login } from "../../../actions/actions";

class LogoutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    axios
      .post("/auth/logout")
      .then(() => {
        this.props.toggleView("off");
        this.props.toggleLoginLogout(false);
        this.props.login("guest");
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === "logout"}>
        <div className="logout">
        <Header icon='LogOut' content='Log-Out to Your Account' />
          <p className="question">Are you sure you want to Logout?</p>
          <Button color="blue" onClick={this.handleLogout}>
            <Icon size="large" name="sign out" corner="true"/>
            Logout
          </Button>
          <Button
            color="red"
            onClick={() => {
              this.props.toggleView("off");
            }}
          >
            <Icon size="large" name="ban" corner="true"/>
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUsername: state.currentUsername
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutModal);
