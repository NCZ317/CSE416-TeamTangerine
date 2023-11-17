import React, { Component } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
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
        const { style } = this.props;

        return (
            <MapContainer
                ref={this.mapRef}
                center={[0, 0]}
                zoom={2}
                zoomControl={false}
                scrollWheelZoom={true}
                style={style ? style : { height: '83vh' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        );
    }
}

export default MapWrapper;
