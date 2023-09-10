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
      //get file type
        //read last few characters?
      //read data
        //geoJson has label-x and label-y
      //rerender with data
    } else {
      alert('Please select a file.');
    }
  };

  //.zip for shapefiles with multiple files
  //.json for geoJson
  render() {
    let labelx = 138.44217;
    let labely = 36.142538;
    return (
      <div>
        <h1>Please Upload a Map file</h1>
        <h3>.shp, .zip, .json, .geojson, or .kml</h3>
        <input type="file" accept=".zip, .shp, .json, .geojson, .kml" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload}>Upload</button>

        <MapContainer center={[labely, labelx]} zoom={5} scrollWheelZoom={true}>
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
