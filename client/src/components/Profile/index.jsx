import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Menu, Segment } from 'semantic-ui-react'

class Profile extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      activeItem: 'stats',
    }
  }
  
  handleItemClick = (e, { name }) => {
    console.log("Active tab", e, name)
    this.setState({ activeItem: name })
  }
    
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
    })
    .catch(err => {
      console.error(err)
    });
  }
  
  render() {
    const { activeItem } = this.state

    return(
      <div className="takless">
        <div className="main">
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
          <Grid>
            <Grid.Column width={4}>
              <Menu fluid vertical tabular>
                <Menu.Item name='stats' active={activeItem === 'stats'} onClick={this.handleItemClick} />
                <Menu.Item name='activity' active={activeItem === 'activity'} onClick={this.handleItemClick} />
                <Menu.Item name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick} />
              </Menu>
            </Grid.Column>

            <Grid.Column stretched width={12} activeIndex="stats">
              <Segment>
                these are stats
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }

}



export default Profile;
