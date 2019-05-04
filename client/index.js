import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class App extends Component {
  handleOnDrop = files => {
    console.log('files log', files);
    files.forEach(async file => {
      let fileToSend = new FormData();
      fileToSend.append('file', file);

      try {
        const { data } = await axios.post('api/uploads/', fileToSend);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    });
  };

  render() {
    return (
      <Dropzone onDrop={this.handleOnDrop}>
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
