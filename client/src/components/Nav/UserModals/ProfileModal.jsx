import React, { Component } from 'react';
import { Input, Button, Header, Modal, Icon, Form, Select, Image } from 'semantic-ui-react';
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, login } from "../../../actions/actions";

class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      newPasswordRetype: ""
    };
    this.handleOnSave = this.handleOnSave.bind(this);
    // this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  // TODO: 
  // Save Images
  // Set Avatar Image
  // Update User Info on Save
  
  handleOnSave(e){
    console.log('P.props', this.props)
    console.log(e)
    this.props.changeModalView('')
  }
  // handleSubmit(e) {
  //   e.preventDefault();
  //   const { username, email, password, passwordRetype } = this.state;
  //   if (password === passwordRetype) {
  //     axios
  //       .post("/auth/signup", {
  //         username,
  //         email,
  //         password
  //       })
  //       .then(res => {
  //         if (res.status === 200) {
  //           this.props.toggleView("off");
  //           this.props.toggleLoginLogout(true);
  //           this.props.login(username);
  //         }
  //       })
  //       .catch(err => {
  //         console.error(err);
  //       });
  //   } else {
  //     // TODO: Alert user passwords must match
  //   }
  // }

  fileSelectorHandler = (event) => {
    console.log(event.target.files[0]);
    this.setState({
      selectedFile: event.target.files[0]
    })
  } 

  fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('image', this.state.selectedFile, this.state.selectedFile.name)
    axios.post(url, fd, {
      onUploadProgress: progressEvent => {
        console.log('Upload progress', Math.round((progressEvent.loaded/ progressEvent.total) * 100));
      }
    })
    .then(res => {
      console.log(res);
      imageRenderOnLoaded = (e) => {
        
      }
    })
    .catch(err => {
      console.error(err)
    });
  }

  render() {
    const { isLoggedIn, currentUser, userEmail } = this.props;

      return (
        <Modal
        open={this.props.selectModal === 'updateProfile'}
        size={"fullscreen"}
        dimmer={true}
        onClose={() => this.props.changeModalView('')}
        closeIcon
        >
        <Modal.Header>Profile</Modal.Header>
        <Modal.Content image>
          <Image wrapped size='small' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrQLg-Na2P4WcdWJjlCZG8YD6Q9DuYLl4w7uf08ibjiIZVQ66d' />
          <Header>{currentUser}</Header>
          <div className="profilePic">
            <p>Profile placeholder</p>
            <div>Image</div>
            <input 
              style={{display: 'none'}} 
              type="file" 
              accept="image/*"
              onChange={this.fileSelectorHandler}
              ref={fileInput => this.fileInput = fileInput }
              />
            <button onClick={() => this.fileInput.click()}>Pick an Image</button>
            <button onClick={this.fileUploadHandler}>Upload</button>
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
                        value={this.state.username}
                        onChange={e => {
                          this.handleInputChange(e, "username");
                        }}
                      />
                    </div>
                  </Input>
                </div>
                <div>
                  <p className="logTag">Email:</p>
                  <Input className="hvr-shadow-radial" required>
                    <div className="ui left icon input">
                      <i class="user icon"></i>
                      <input
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={e => {
                          this.handleInputChange(e, "email");
                        }}
                      />
                    </div>
                  </Input>
                </div>
                <div>
                  <p className="logTag">Current Password:</p>
                  <Input className="hvr-shadow-radial" required>
                    <div class="ui left icon input">
                      <i class="lock icon"></i>
                      <input
                        type="password"
                        placeholder="Password"
                        value={this.state.currentPassword}
                        onChange={e => {
                          this.handleInputChange(e, "password");
                        }}
                      />
                    </div>
                  </Input>
                </div>
                <div>
                  <p className="logTag">New Password:</p>
                  <Input className="hvr-shadow-radial" required>
                    <div class="ui left icon input">
                      <i class="lock icon"></i>
                      <input
                        type="password"
                        placeholder="Password"
                        value={this.state.newPassword}
                        onChange={e => {
                          this.handleInputChange(e, "password");
                        }}
                      />
                    </div>
                  </Input>
                </div>
                <div>
                  <p className="logTag">Retype New Password:</p>
                  <Input className="hvr-shadow-radial" required>
                    <div class="ui left icon input">
                      <i class="lock icon"></i>
                      <input
                        type="password"
                        placeholder="Re-Type Password"
                        value={this.state.newPasswordRetype}
                        onChange={e => {
                          this.handleInputChange(e, "passwordRetype");
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
    )
  } 
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser,
    userEmail: state.userEmail
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileModal);