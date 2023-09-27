import React, { Component } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as shapefile from 'shapefile';
import toGeoJSON from 'togeojson';
import JSZip from 'jszip';
import Header from './components/Header';
import MapCard from './components/MapCard';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

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
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      this.setState({ selectedFile: selectedFile }, () => {
        alert(`File selected: ${selectedFile.name}`);
  
        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = this.handleUpload;
  
      });
    }
    else {
      const map = this.mapRef.current;
      if (map) {
        
        // Remove the previous GeoJSON layer if it exists
        if (this.geoJsonLayer) {
          map.removeLayer(this.geoJsonLayer);
        }
    
        // Render the map data
        const { mapData } = this.state;
        if (mapData) {
           // Add the base TileLayer
           const tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
          ).addTo(map);
        }
      }
    }
  };

  handleUpload = (event) => {
    const { selectedFile } = this.state;
    if (selectedFile) {
      if (selectedFile.name.endsWith('.zip')) {
        // Handle .zip file containing shapefiles
        alert('Parsing Shapefile ZIP');
  
        const reader = new FileReader();
        reader.onload = async (e) => {
          const zipData = e.target.result;
  
          // Read the contents of the zip file using JSZip
          const zip = new JSZip();
          const zipContents = await zip.loadAsync(zipData);
  
          // Extract the .shp and .dbf files as ArrayBuffer
          const shpBuffer = await zipContents.file(/\.shp$/)[0].async('arraybuffer');
          const dbfBuffer = await zipContents.file(/\.dbf$/)[0].async('arraybuffer');
  
          // Parse the .shp file
          const geojson = await shapefile.read(
            shpBuffer,
            dbfBuffer,
            { type: 'buffer' } // Specify the type of data source
          );
  
          this.setState({ mapData: geojson }, () => {
            this.renderMap();
          });
        };
  
        reader.readAsArrayBuffer(selectedFile);
      } 
      else if (selectedFile.name.endsWith('.shp')) {
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
        alert('Parsing GeoJSON');
        const parsedData = JSON.parse(event.target.result); // Parse the JSON data
        console.log(parsedData);
        this.setState({ mapData: parsedData }, () => {
          this.renderMap();
        });
        // Update this.state.mapData with the parsed data
      } else if (selectedFile.name.endsWith('.kml')) {
        // Handle KML parsing
        alert('Parsing KML');
        const reader = new FileReader();
        reader.onload = (e) => {
          const kmlData = e.target.result;
          const kmlParser = new DOMParser();
          const kmlDoc = kmlParser.parseFromString(kmlData, 'application/xml');
          const geojson = toGeoJSON.kml(kmlDoc);

          this.setState({ mapData: geojson }, () => {
            this.renderMap();
          });
        };
        reader.readAsText(selectedFile);
      } else {
        alert('Please upload the specified filetype');
      }
    } else {
      alert('Please select a file');
    }
  };

  // Function to render or update the map with new data
renderMap = () => {
  // Get the map instance
  const map = this.mapRef.current;
  console.log(L.Icon.Default.prototype._getIconUrl());
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
        <Header/>
        <MapCard/>
        <h1>Please Upload a Map file</h1>
        <h3>.shp, .json, .geojson, or .kml</h3>
        <input type="file" accept=".shp, .json, .geojson, .kml, .zip" onChange={this.handleFileChange} />

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
