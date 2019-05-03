import React, { Component } from "react";
import ReactDOM from "react-dom";
import Dropzone from "react-dropzone";
import axios from "axios";

class App extends Component {
  handleOnDrop = async files => {
    console.log('files log', files);
    let file = new FormData();
    file.append('name', files[0])
    console.log(file)
    try {
          const { data } = await axios.post('/upload', file);
          console.log(data);
        } catch (error) {
          console.error(error);
        }
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

ReactDOM.render(<App />, document.getElementById("app"));
