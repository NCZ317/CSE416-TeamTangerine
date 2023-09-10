import React, { Component } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedFile: null,
      mapData: null,
    };
  }

  handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    this.setState({ selectedFile });
    if (selectedFile) {
      alert(`File selected: ${selectedFile.name}`);
    }
  };

  handleUpload = () => {
    const { selectedFile } = this.state;

    if (selectedFile) {
      if(selectedFile.name.endsWith('.shp')) {
        //Handle shp parsing
      }
      else if (selectedFile.name.endsWith('.geojson')) {
        //handle GeoJSON parsing
      }
      else if (selectedFile.name.endsWith('.kml')) {
        //handle kml parsing
      }
      else {
        alert("Please upload the specified filetype");
      }
    } 
    else {
      alert('Please select a file');
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
