import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
  }
  handleDrop = acceptedFiles => {
    console.log(acceptedFiles);
    acceptedFiles.map(async file => {
      // Initial FormData
      const formData = new FormData();
      formData.append('myImage', file);
      console.log(formData);

      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      try {
        const res = await axios.post('/upload', formData);
        const data = res.data;
        // const fileURL = data.secure_url; // You should store this URL for future references in your app
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    });
  };

  render() {
    return (
      <Dropzone onDrop={this.handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
