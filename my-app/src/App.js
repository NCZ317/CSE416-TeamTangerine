import React, { useState,useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
function App(){
  const [selectedFile, setFile] = useState(null);
  const [position, setPosition] = useState([0,0]);
  const [zoomValue, setZoom] = useState(2);

  const handleFileChange = (event) => {
    var reader = new FileReader();
    const selectedFile = event.target.files[0];
    reader.readAsText(selectedFile);
    setFile({ selectedFile: selectedFile});
    console.log(selectedFile);
    if (selectedFile) {
      alert(`File selected: ${selectedFile.name}`);
    }
    if(selectedFile.name.endsWith('.json')){
      reader.onload = handleUpload;
    }
  } 
  function handleUpload(event){
    //handle GeoJSON parsing
    console.log(event.target.result);
    var parsed = JSON.parse(event.target.result);
    console.log(parsed.features[0]);
    //highlight features
    //geoJSon has label-x and label-y
    setPosition([parsed.features[0].properties.label_y,parsed.features[0].properties.label_x]);
    setZoom(5);
  }
  /* function handleUpload(event){
    console.log(selectedFile);
    if (selectedFile) {
      if(selectedFile.name.endsWith('.shp')) {
        //Handle shp parsing
      }
      else if (selectedFile.name.endsWith('.json')) {
        //handle GeoJSON parsing
        console.log(event.target.result);
        var parsed = JSON.parse(event.target.result);
        console.log(parsed.features[0]);
        //highlight features
        //geoJSon has label-x and label-y
        setPosition([parsed.features[0].properties.label_y,parsed.features[0].properties.label_x]);
        setZoom()
      }
      else if (selectedFile.name.endsWith('.kml')) {
        //handle kml parsing
      }
      else {
        alert("Please upload the specified filetype");
      }
      //rerender with data
    } 
    else {
      alert('Please select a file');
    }
  }; */
  

  //.json for geoJson
  return (
    <div>
      <p>center(lat,long): {position[0]},{position[1]}</p>
      <h1>Please Upload a Map file</h1>
      <h3>Shapefile(.shp), GeoJSON(.json), or KeyHole(.kml)</h3>
      <input type="file" accept=".shp, .json, .kml" onChange={handleFileChange} />
      {/* <button onClick={this.handleUpload}>Upload</button> */}
      <div id="map">
        <MapContainer center={position} zoom={zoomValue} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
