import React, { Component } from 'react';
import axios from 'axios';

class Profile extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    }
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
    return(
      <div className="takless">
        <div className="main">
          <p>Profile placeholder</p>
          <div>Image</div>
          <input 
            style={{display: 'none'}} 
            type="file" 
            onChange={this.fileSelectorHandler}
            ref={fileInput => this.fileInput = fileInput }
          />
          <button onClick={() => this.fileInput.click()}>Pick an Image</button>
          <button onClick={this.fileUploadHandler}>Upload</button>
        </div>
      </div>
    );
  }

}



export default Profile;
