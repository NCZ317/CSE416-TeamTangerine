import React, { Component } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

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

        <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
</MapContainer>
      </div>
    );
  }
}

export default App;
