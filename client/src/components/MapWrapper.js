import React, { Component } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class MapWrapper extends Component {
    constructor() {
        super();
        this.state = {
            selectedFile: null,
            mapData: null,
        };
        this.mapRef = React.createRef();
    }
    render() {
        return (
            <div>
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

export default MapWrapper