import React, { Component } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as shapefile from 'shapefile';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedFile: null,
      mapData: null,
    };
    this.mapRef = React.createRef();
  }

  handleFileChange = (event) => {
    var reader = new FileReader();
    const selectedFile = event.target.files[0];
    reader.readAsText(selectedFile);
    reader.onload = this.handleUpload;
    this.setState({ selectedFile });
    if (selectedFile) {
      alert(`File selected: ${selectedFile.name}`);
    }
  };

  handleUpload = (event) => {
    const { selectedFile } = this.state;
    if (selectedFile) {
      if (selectedFile.name.endsWith('.shp')) {
        // Handle shp parsing
        alert('Parsing Shapefile');
        const reader = new FileReader();
        reader.onload = async (e) => {
          const shpBuffer = e.target.result;

          try {
            const geojson = await shapefile.read(shpBuffer);
            console.log(geojson);
            this.setState({ mapData: geojson }, () => {
              this.renderMap();
            });
          } catch (error) {
            console.error('Error parsing SHP file:', error);
          }
        };

        reader.readAsArrayBuffer(selectedFile);
      } else if (selectedFile.name.endsWith('.json') || selectedFile.name.endsWith('.geojson')) {
        // Handle GeoJSON parsing
        //alert('Parsing GeoJSON');
        const parsedData = JSON.parse(event.target.result); // Parse the JSON data
        console.log(parsedData);
        this.setState({ mapData: parsedData }, () => {
          this.renderMap();
        });
        this.renderMap();
        // Update this.state.mapData with the parsed data
      } else if (selectedFile.name.endsWith('.kml')) {
        // Handle KML parsing
        alert('Parsing KML');
        // Update this.state.mapData with the parsed data
      } else {
        alert('Please upload the specified filetype');
      }
      // Rerender the map with data if needed
      this.renderMap();
    } else {
      alert('Please select a file');
    }
  };

  // Function to render or update the map with new data
renderMap = () => {
  // Get the map instance
  const map = this.mapRef.current;
  if (map) {
    // Remove the previous GeoJSON layer if it exists
    if (this.geoJsonLayer) {
      map.removeLayer(this.geoJsonLayer);
    }

    // Render the map data
    const { mapData } = this.state;
    if (mapData) {
      // Create a new GeoJSON layer
      this.geoJsonLayer = L.geoJSON(mapData);

      // Add the base TileLayer
      const tileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      // Add the new GeoJSON layer on top of the base TileLayer
      this.geoJsonLayer.addTo(map);

      // Fit the map to the bounds of the GeoJSON layer
      if (this.geoJsonLayer.getBounds().isValid()) {
        // Fit the map to the bounds of the GeoJSON layer
        map.fitBounds(this.geoJsonLayer.getBounds());
      } else {
        // Handle the case when bounds are not valid (e.g., empty GeoJSON data)
        // You can choose to display an error message or do something else here
        console.error('Bounds are not valid');
      }
    }
  }
};



  //.json for geoJson
  render() {
    return (
      <div>
        <h1>Please Upload a Map file</h1>
        <h3>.shp, .json, .geojson, or .kml</h3>
        <input type="file" accept=".shp, .json, .geojson, .kml" onChange={this.handleFileChange} />

        <MapContainer ref={this.mapRef} center={[0, 0]} zoom={2} scrollWheelZoom={true}>
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
