import React, { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GlobalStoreContext } from '../store/index.js';
import L from 'leaflet';

const MapWrapper = ({ style }) => {
    const { store } = useContext(GlobalStoreContext);
    const [mapData, setMapData] = useState(null);
    const [map, setMap] = useState(null);


    //USED FOR RENDERING THE INFO POPUP FOR CHOROPLETH MAPS
    const [region, setRegion] = useState({
        name: "",
        value: ""
    });

    useEffect(() => {
        // console.log(store.currentMap);
        if (store.currentMap && store.currentMap.jsonData) {
            setMapData(store.currentMap.jsonData);
        } else {
            setMapData(null);
        }
    }, [store.currentMap]); // Listen for changes in store.currentMap

    const FitBounds = () => {
        const map = useMap();
    
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
    
        return null;
    };

    const onEachFeature = (feature, layer) => {

        // Add click event listener
        layer.on({
            click: handleFeatureClick,
            mouseover: (e) => {
                
                if (store.mapTemplate === 'choroplethMap') {
                    //UPDATE THE POPUP STATE TO RERENDER
                    setRegion({
                        name: feature.properties.name,
                        value: feature.properties.value
                    });
                }

            },

            mouseout: (e) => {
                if (store.mapTemplate === 'choroplethMap') {
                    setRegion({
                        name: "",
                        value: ""
                    });
                }

            }
        });

    };

    const handleFeatureClick = (event) => {
        const clickedLayer = event.target;
        console.log(clickedLayer);
        store.setCurrentRegion(clickedLayer);
        // console.log("FEATURE: " + JSON.stringify(clickedLayer.feature));
        console.log("GEOMETRY: " + JSON.stringify(clickedLayer.feature.properties.name));
 
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

    //THIS OBJECT CONTAINS STYLING FOR ALL TYPES OF MAPS
    const mapDataStyle = {
        color: store.currentMapLayer && store.currentMapLayer.style.borderColor ? store.currentMapLayer.style.borderColor : '#79C200',
        weight: store.currentMapLayer && store.currentMapLayer.style.borderWeight ? store.currentMapLayer.style.borderWeight : 2,
        stroke: store.currentMapLayer && store.currentMapLayer.style.border, 
        fillOpacity: 0.7,
        dashArray: store.currentMapLayer && store.currentMapLayer.style.borderDashed ? '5 5' : '',
    }

    //THIS FUNCTION IS CALLED EVERY TIME THE MAP IS RENDERED --> RENDERS UPDATED STYLES
    const getMapStyle = (feature) => {

        if (store.mapTemplate === 'choroplethMap') {
            return {
                ...mapDataStyle,
                fillColor: getChoroplethColor(feature.properties.value)
            }
        }
        return mapDataStyle
    }

    //--------------------------------------------------------------------------------------------------------------//
    // CHOROPLETH MAPS

    //THIS FUNCTION ASSUMES THAT THE VALUES ARE ARRANGED IN DECREASING ORDER IN THE COLORSCALE (LEGEND)
    const getChoroplethColor = (value) => {
        const colorScale = store.currentMapLayer.colorScale;

        // Check if value is numeric
        const numericValue = parseFloat(value);
    
        if (!isNaN(numericValue) && isFinite(numericValue)) {
            // If numeric, iterate through colorScale array to find the appropriate color
            for (var i = 0; i < colorScale.length; i++) {
                const scaleValue = parseFloat(colorScale[i].value);
                if (!isNaN(scaleValue) && isFinite(scaleValue) && numericValue >= scaleValue) {
                    return colorScale[i].color;
                }
            }
        } else {
            // If not numeric, treat as categorical data
            const categoricalMatch = colorScale.find((item) => item.value === value);
    
            // If a match is found, return the corresponding color
            if (categoricalMatch) {
                if (categoricalMatch.value === "") {
                    return store.currentMapLayer.defaultColor;   //RETURN DEFAULT VALUE WHEN REGION DATA IS ""
                }
                return categoricalMatch.color;
            }
        }
    
        // Default color if no condition is met
        return store.currentMapLayer.defaultColor;
    }

    //POPUP THAT SHOWS THE REGION NAME AND VALUE WHEN HOVERED OVER
    const InfoPopup = ({ position, name, value }) => {
        const map = useMap();
    
        useEffect(() => {
            const container = L.DomUtil.create('div', 'info-popup');

            //ADD VALUETYPE PROPERTY HERE
            if (!name || !value) {
                container.innerHTML = `<span>Hover over a region with data</span>`;
            } else {
                container.innerHTML = `<h4>${name}: ${value}</h4>`;
            }

            L.DomEvent.disableClickPropagation(container);
    
            const control = L.control({ position });
            control.onAdd = () => container;
            control.addTo(map);
    
            return () => {
                // Cleanup on component unmount
                control.remove();
            };
        }, [map, position, name, value]);
    
        return null;
    };

    //LEGEND VALUE
    const MapLegend = ({position, legend}) => {
        const map = useMap();

        useEffect(() => {
            const container = L.DomUtil.create('div', 'legend info-popup');
            if (store.mapTemplate === 'choroplethMap') {

                container.innerHTML += `<h4>${store.currentMapLayer.valueField}</h4>`
                let legendValues = legend.map(x => x.value).reverse();

                for (var i = 0; i < legendValues.length; i++) {
                    if (legendValues[i] !== "") {
                        if (isNaN(legendValues[i])) {
                            container.innerHTML +=
                            '<i style="background:' + getChoroplethColor(legendValues[i]) + '"></i>' +
                            legendValues[i] + '<br>';
    
                        } else {
                            container.innerHTML += 
                            '<i style="background:' + getChoroplethColor(legendValues[i]) + '"></i> ' +
                            legendValues[i] + (legendValues[i + 1] ? '&ndash;' + legendValues[i + 1] + '<br>' : '+');
                        }

                    }
                }
    
                L.DomEvent.disableClickPropagation(container);
        
                const control = L.control({ position });
                control.onAdd = () => container;
                control.addTo(map);
        
                return () => {
                    // Cleanup on component unmount
                    control.remove();
                };
            }

        }, [position, legend])
    }
    
    //--------------------------------------------------------------------------------------------------------------//


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

            {mapData && <GeoJSON data={mapData} style={getMapStyle}
                onEachFeature={onEachFeature}
            />}
            {/* <FitBounds /> IS BUGGY; CONSTANTLY ZOOMS OUT*/}

            {/* RENDER ONLY IF TITLE OR DESCRIPTION IS AVAILABLE */}
            {store.currentMapLayer && <CustomTitleControl position="topleft" title={store.currentMapLayer.graphicTitle} />}
            {store.currentMapLayer && <CustomDescriptionControl position="topleft" description={store.currentMapLayer.graphicDescription} />}
            {store.mapTemplate === 'choroplethMap' && <InfoPopup position="topleft" name={region.name} value={region.value} />}
            {store.mapTemplate === 'choroplethMap' && <MapLegend position="topleft" legend={store.currentMapLayer.colorScale} />}
        </MapContainer>

    );
};

export default MapWrapper;
