import React, { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GlobalStoreContext } from '../store/index.js';
import L from 'leaflet';

const MapWrapper = ({ style }) => {
    const { store } = useContext(GlobalStoreContext);
    const [mapData, setMapData] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        console.log(store.currentMap);
        if (store.currentMap && store.currentMap.jsonData) {
            setMapData(store.currentMap.jsonData);
            //store.currentRegion = 
        } else {
            setMapData(null);
        }
    }, [store.currentMap]); // Listen for changes in store.currentMap

    const FitBounds = () => {
        const map = useMap();
    
        useEffect(() => {
            if (mapData) {
                // Calculate bounds from GeoJSON
                const bounds = L.geoJSON(mapData).getBounds();
    
                // Check if the bounds are valid (not equal to default bounds)
                const isValidBounds =
                    bounds.isValid() &&
                    bounds.getSouthWest().lat !== 0 &&
                    bounds.getSouthWest().lng !== 0 &&
                    bounds.getNorthEast().lat !== 0 &&
                    bounds.getNorthEast().lng !== 0;
    
                if (isValidBounds) {
                    // Fit bounds with padding
                    map.fitBounds(bounds, { padding: [10, 10] });
                } else {
                    // Handle invalid bounds (e.g., when GeoJSON has no features)
                    console.log("Invalid bounds or no features in GeoJSON");
                    // Optionally, you can set a default view or handle it differently.
                }
            }
        }, [map, mapData]);
    
        return null;
    };

    const handleFeatureClick = (event) => {
        const clickedLayer = event.target;
        console.log(clickedLayer);
        store.setCurrentRegion(clickedLayer);
        console.log("FEATURE: " + JSON.stringify(clickedLayer.feature));
 
    };

    const onEachFeature = (feature, layer) => {

        // Add click event listener
        layer.on({
            click: handleFeatureClick,
        });

        // if (store.currentMapLayer && store.currentMapLayer.style.borderColor) {
        //     layer.setStyle({color: store.currentMapLayer.style.borderColor});
        // }   

        // layer.setStyle({
        //     color: "#FF0000",
        //     dashArray: '5, 5',
        //     weight: 2,
        //     opacity: 1
        // })


    };


    const CustomTitleControl = ({ position, title }) => {
        const map = useMap();
    
        useEffect(() => {
            const container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom-title');
            container.innerHTML = `<span style="${getTitleStyle()}">${title}</span>`;
            L.DomEvent.disableClickPropagation(container);
    
            const control = L.control({ position });
            control.onAdd = () => container;
            control.addTo(map);
    
            return () => {
                // Cleanup on component unmount
                control.remove();
            };
        }, [map, position, title]);
    
        return null;
    };

    const CustomDescriptionControl = ({ position, description }) => {
        const map = useMap();
    
        useEffect(() => {
            const container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom-title');
            container.innerHTML = `<span style="${getDescriptionStyle()}">${description}</span>`;
            L.DomEvent.disableClickPropagation(container);
    
            const control = L.control({ position });
            control.onAdd = () => container;
            control.addTo(map);
    
            return () => {
                // Cleanup on component unmount
                control.remove();
            };
        }, [map, position, description]);
    
        return null;
    };

    //ADD COLOR AND FONT SIZE TO THE STYLES BELOW INSTEAD OF THE CSS FILE
    const getTitleStyle = () => {
        let style = '';

        if (store.currentMapLayer.style.titleFontSize) {
            style += `font-size: ${store.currentMapLayer.style.titleFontSize}px;`;
        }
        if (store.currentMapLayer.style.titleFontColor) {
            style += `color: ${store.currentMapLayer.style.titleFontColor};`
        }
        if (store.currentMapLayer.style.titleStyles && store.currentMapLayer.style.titleStyles.italic) {
            style += 'font-style: italic;';
        }
        if (store.currentMapLayer.style.titleStyles && store.currentMapLayer.style.titleStyles.bold) {
            style += 'font-weight: bold;';
        }
        if (store.currentMapLayer.style.titleStyles && store.currentMapLayer.style.titleStyles.underlined) {
            style += 'text-decoration: underline;';
        }
        return style;
    };
    const getDescriptionStyle = () => {
        let style = '';

        if (store.currentMapLayer.style.descriptionFontSize) {
            style += `font-size: ${store.currentMapLayer.style.descriptionFontSize}px;`;
        }
        if (store.currentMapLayer.style.descriptionFontColor) {
            style += `color: ${store.currentMapLayer.style.descriptionFontColor};`
        }
        if (store.currentMapLayer.style.descriptionStyles && store.currentMapLayer.style.descriptionStyles.italic) {
            style += 'font-style: italic;';
        }
        if (store.currentMapLayer.style.descriptionStyles && store.currentMapLayer.style.descriptionStyles.bold) {
            style += 'font-weight: bold;';
        }
        if (store.currentMapLayer.style.descriptionStyles && store.currentMapLayer.style.descriptionStyles.underlined) {
            style += 'text-decoration: underline;';
        }
        return style;
    };

    const mapDataStyle = {
        color: store.currentMapLayer && store.currentMapLayer.style.borderColor ? store.currentMapLayer.style.borderColor : '#79C200',
        weight: store.currentMapLayer && store.currentMapLayer.style.borderWeight ? store.currentMapLayer.style.borderWeight : 2,
        stroke: store.currentMapLayer && store.currentMapLayer.style.border, 
        opacity: 1,
        dashArray: store.currentMapLayer && store.currentMapLayer.style.borderDashed ? '5 5' : '',
    }

    if (store.mapTemplate == 'choroplethMap' && store.currentMap.legend){
        L.geoJson(mapData, {style: chorpleth}).addTo(map);
    }else{
        
    }
    function chorpleth(feature) {
        return {
            fillColor: getColor(feature.properties.value),
            color: '#79C200',
            weight: 2, 
            opacity: 0.5,
        };
    }
    function getColor(d) {
        for (var i = 0; i< store.currentMap.legend.length ; i++){
            if (d>=store.currentMap.legend[i].value)
                return store.currentMap.legend[i].color;

        }
    }

    
    return (
        <MapContainer
            center={[0, 0]}
            zoom={2}
            zoomControl={false}
            scrollWheelZoom={true}
            style={style ? style : { height: '83vh'}}
            ref={setMap}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mapData && <GeoJSON data={mapData} style={mapDataStyle}
                onEachFeature={onEachFeature}
            />}
            <FitBounds />

            {/* RENDER ONLY IF TITLE OR DESCRIPTION IS AVAILABLE */}
            {store.currentMapLayer && <CustomTitleControl position="topleft" title={store.currentMapLayer.graphicTitle} />}
            {store.currentMapLayer && <CustomDescriptionControl position="topleft" description={store.currentMapLayer.graphicDescription} />}
        </MapContainer>

    );
};

export default MapWrapper;
