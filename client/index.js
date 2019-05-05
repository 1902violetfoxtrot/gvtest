import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
  }
  handleOnDrop = files => {
    this.setState({
      files: files.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    });
    files.map(async file => {
      let filesToSend = new FormData();
      filesToSend.append('files', file);
      try {
        const { data } = await axios.post('api/uploads/', filesToSend);
      } catch (error) {
        console.error(error);
      }
    });
  };
  handleOnDropRejected = () => {
    window.alert(
      'One or more of your files is greater than 6MB and cannot be uploaded'
    );
  };

  componentWillUnmount() {
    this.state.files.forEach(file => URL.revokeObjectURL(file.preview));
  }
  render() {
    const MAX_SIZE = 6000000;
    const ACCEPTED_FILE_TYPES =
      'image/jpeg, image/jpg image/png, image/tiff,image/gif';
    const { files } = this.state;
    return (
      <Dropzone
        onDrop={this.handleOnDrop}
        accept={ACCEPTED_FILE_TYPES}
        maxSize={MAX_SIZE}
        multiple={true}
        onDropRejected={this.handleOnDropRejected}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div className="filesClass" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
              <div className="filesListClass">
                {files.map(file => {
                  return (
                    <ul className="filePreviews" key={file.name}>
                      <img src={file.preview} width="200" height="200" />
                    </ul>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
