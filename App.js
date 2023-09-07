import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedFile: null,
    };
  }

  handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    this.setState({ selectedFile });
  };

  handleUpload = () => {
    const { selectedFile } = this.state;

    if (selectedFile) {
      alert(`File selected: ${selectedFile.name}`);
    } else {
      alert('Please select a file.');
    }
  };

  render() {
    return (
      <div>
        <h1>Please Upload a Map file</h1>
        <h3>.shp .geojson or .kml</h3>
        <input type="file" accept=".shp, .geojson, .kml" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload}>Upload</button>
      </div>
    );
  }
}

export default App;
