import React, { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GlobalStoreContext } from '../store/index.js';
import L from 'leaflet';

const MapWrapper = ({ style }) => {
    const { store } = useContext(GlobalStoreContext);
    const [mapData, setMapData] = useState(null);
    const mapRef = useRef();

    useEffect(() => {
        console.log(store.currentMap);
        if (store.currentMap && store.currentMap.jsonData) {
            setMapData(store.currentMap.jsonData);
        } else {
            setMapData(null);
        }
    }, [store.currentMap]); // Listen for changes in store.currentMap

    const FitBounds = () => {
        const map = useMap();

        useEffect(() => {
            if (mapData) {
                const bounds = L.geoJSON(mapData).getBounds();
                map.fitBounds(bounds, { padding: [10, 10] });
            }
        }, [map, mapData]);

        return null;
    };

    const mapDataStyle = {
        color: '#79C200', weight: 2, opacity: 1 
    }

    return (
        <MapContainer
            center={[0, 0]}
            zoom={2}
            zoomControl={false}
            scrollWheelZoom={true}
            style={style ? style : { height: '83vh' }}
            whenCreated={(map) => (mapRef.current = map)}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapData && <GeoJSON data={mapData} style={mapDataStyle} />}
            <FitBounds />
        </MapContainer>
    );
};

export default MapWrapper;
