import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap, Marker, HeatLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GlobalStoreContext } from '../store/index.js';
import DeleteIcon from '@mui/icons-material/Delete';
import L from 'leaflet';
import 'leaflet-imageoverlay-rotated';
import 'leaflet-polylinedecorator';
import 'leaflet-arrowheads';
import * as turf from '@turf/turf';
import _ from 'lodash';
import 'leaflet.heat';

//add let prev = _.cloneDeep(store.currentMapLayer); before any changes to store
var markerGroup = L.layerGroup();
var arrowGroup = L.layerGroup();
const MapWrapper = ({ style}) => {
    const { store } = useContext(GlobalStoreContext);
    const [mapData, setMapData] = useState(null);
    const [map, setMap] = useState(null);
    const [dotsData, setDotsData] = useState([]);


    //USED FOR RENDERING THE INFO POPUP FOR CHOROPLETH MAPS
    const [region, setRegion] = useState({
        name: "",
        value: ""
    });

    //Reference to the region label --> removed and added when region label changes
    const labelRef = useRef(null);

    //Reference to heat layer
    const heatLayerRef = useRef(null);


    useEffect(() => {
        // console.log(store.currentMap);
        if (store.currentMap && store.currentMap.jsonData) {
            setMapData(store.currentMap.jsonData);
        } else {
            setMapData(null);
        }
    }, [store.currentMap]); // Listen for changes in store.currentMap
    

    const FitBounds = () => {
        setMap(useMap());
    
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
            click: (event) => handleFeatureClick(event, feature),
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

    const handleFeatureClick = (event, feature) => {
        // Retrieve the clicked coordinates from the event
        const latLng = event.latlng;
        
        // Access the latitude and longitude
        const latitude = latLng.lat;
        const longitude = latLng.lng;

        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        const clickedLayer = event.target;
        const featureIndex = store.currentMap.jsonData.features.indexOf(feature);
        store.setCurrentRegion(clickedLayer, featureIndex);
    };

    const getLatLang = (event) => {
        console.log("clicked");
        console.log(event);
        alert('clicked');
    }

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
        // fillOpacity: 0.7,
        dashArray: store.currentMapLayer && store.currentMapLayer.style.borderDashed ? '5 5' : '',
    }

    window.updateCoordinates = function(currentLat, currentLng) {
        const newLat = document.getElementById('newLat').value;
        const newLng = document.getElementById('newLng').value;
    
        // Validate newLat and newLng if needed
    
        // Update the coordinates
        console.log(`Update coordinates from (${currentLat}, ${currentLng}) to (${newLat}, ${newLng})`);
    };

    //THIS FUNCTION IS CALLED EVERY TIME THE MAP IS RENDERED --> RENDERS UPDATED STYLES
    const getMapStyle = (feature) => {
        const featureIndex = store.currentMap.jsonData.features.indexOf(feature);
        const featureFound = store.currentMapLayer.currentRegions.findIndex(region => region.featureIndex === featureIndex);

        //console.log(store.mapTemplate);
        if (store.mapTemplate === 'dotDensityMap') {
            let dots = [];
            for (let i = 0; i < store.currentMapLayer.geographicRegion.length; i++) {
                if (store.currentMapLayer.geographicRegion[i].name === feature.properties.name) {
                    dots = store.currentMapLayer.geographicRegion[i].dots;
                    break;
                }
            }
            //console.log("dots for " + feature.properties.name);
            //console.log(dots);

            if (store.mapTemplate === 'dotDensityMap') {
                let dots = [];
                for (let i = 0; i < store.currentMapLayer.geographicRegion.length; i++) {
                    if (store.currentMapLayer.geographicRegion[i].name === feature.properties.name) {
                        dots = store.currentMapLayer.geographicRegion[i].dots;
                        break;
                    }
                }
                
                if(featureIndex == 0) {
                    map.eachLayer((layer) => {
                        if (layer instanceof L.CircleMarker) {
                            map.removeLayer(layer);
                        }
                    });
                }
                let dotColor = '#000000';
                let dotSize = 1;
                if (store.currentMapLayer) {
                    dotColor = store.currentMapLayer.dotColor;
                    dotSize = store.currentMapLayer.dotSize;
                }

                // Draw the dots of this region onto the map
                dots.forEach((dot) => {
                    const marker = L.circleMarker(L.latLng(dot.coordinates[1], dot.coordinates[0]), {
                        radius: dotSize,
                        weight: 0,
                        fillColor: dotColor,
                        fillOpacity: 1
                    }).addTo(map);
                
                    // Use a custom property to associate the feature with the marker
                    marker.myFeature = feature;
                
                    marker.bindPopup(`
                        <div>Latitude: ${dot.coordinates[1]}</div>
                        <div>Longitude: ${dot.coordinates[0]}</div>
                        <input type="text" id="newLat" placeholder="New Latitude"/>
                        <input type="text" id="newLng" placeholder="New Longitude"/>
                        <button onclick="updateCoordinates(${dot.coordinates[1]}, ${dot.coordinates[0]})">Update</button>`);
                
                    marker.on('popupopen', function() {
                        window.updateCoordinates = function(currentLat, currentLng) {
                            console.log(marker.myFeature);
                            console.log(dot.coordinates);
                            const newLat = document.getElementById('newLat').value;
                            const newLng = document.getElementById('newLng').value;
                            console.log(`Update coordinates from (${currentLat}, ${currentLng}) to (${newLat}, ${newLng})`);
                
                            let regionPolygon = marker.myFeature.geometry; // Assuming the correct structure
                            console.log(regionPolygon);
                            let newPoint = turf.point([newLng, newLat]);
                
                            if (turf.booleanPointInPolygon(newPoint, regionPolygon)) {
                                let prev = _.cloneDeep(store.currentMapLayer);
                                dot.coordinates = turf.getCoord(newPoint);
                                store.addUpdateLayerTransaction(prev);
                            } else {
                                console.log("Dot is outside region");
                                map.closePopup();
                            }
                        };
                    });
                });

            }
        }

        if (featureFound !== -1) {

            if (labelRef.current) {
                labelRef.current.removeFrom(map);
            }

            const labelColor = store.currentMapLayer.currentRegions[featureFound].style.labelColor;
            const customIcon = L.divIcon({
                className: 'region-label',
                html: `<div style="color: ${labelColor || 'black'}">${store.currentMapLayer.currentRegions[featureFound].label}</div>`,
            });

            const bounds = L.geoJSON(feature).getBounds(); // Get bounds of the current feature
            const center = bounds.getCenter(); // Get the center of the bounds

            // Create a marker using the custom div element
            const marker = L.marker(center, {
                icon: customIcon,
            });

            // Add the marker to the GeoJSON layer
            marker.addTo(map);
            labelRef.current = marker;
        }

        if (store.mapTemplate === 'choroplethMap') {
            return {
                ...mapDataStyle,
                fillColor: getChoroplethColor(feature.properties.value)
            }
        } else {
            //UPDATE FILL COLOR AND FILL OPACITY FOR ALL OTHER TYPES OF MAPS IF USER HAS CHANGED IT

            if (featureFound !== -1) {
                const regionStyle = store.currentMapLayer.currentRegions[featureFound].style;

                return {
                    ...mapDataStyle,
                    // fillColor: store.currentMapLayer.currentRegions[featureFound].style.fillColor,
                    // fillOpacity: store.currentMapLayer.currentRegions[featureFound].style.fillOpacity
                    fillColor: regionStyle.fillColor,
                    fillOpacity: regionStyle.fillOpacity ? regionStyle.fillOpacity : 0.7
                }
            }
        }

        return mapDataStyle
    }

    //-----------------------------------------CHOROPLETH MAPS---------------------------------------------------//

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

    //----------------------------------------DOT DENSITY MAPS--------------------------------------------------//
    // const generateDots = (geographicRegion) => {
    //     //console.log("GENERATING DOTS");
    //     //console.log(store.mapTemplate);
    //     const dots = [];

    //     geographicRegion.forEach((region) => {
    //         region.dots.forEach((dot) => {
    //             dots.push({
    //                 coordinates: dot.coordinates,
    //                 name: region.name,
    //             });
    //         });
    //     });

    //     return dots;
    // };

    // const renderDots = () => {
    //     //console.log("RENDERING DOTS");
    
    //     dotsData.forEach((dot, index) => {
    //         //console.log("ADDING", L.latLng(dot.coordinates[0], dot.coordinates[1]));
    //         L.circleMarker(L.latLng(dot.coordinates[1], dot.coordinates[0]), { radius: 1, weight: 1, color: 'black' }).addTo(
    //         map
    //       )
    //     });
    // };

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
                
                if (store.mapTemplate === 'dotDensityMap') {
                    const dotLegendValue = store.currentLayer.dotValue;
                    container.innerHTML +=
                        '<i class="dot-legend" style="background:' + store.currentMapLayer.dotColor + '"></i> ' +
                        dotLegendValue + '<br>';
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

    const DotLegend = ({ position, dotColor, dotSize, dotValue, valueField }) => {
        const map = useMap();
    
        useEffect(() => {
            const container = L.DomUtil.create('div', 'legend info-popup');
    
            container.innerHTML += `<h4>${valueField} per Dot</h4>`;
            container.innerHTML += `<svg height="9px" width="12px"><circle cx="4" cy="4" r="4" fill="${dotColor}" /></svg> ${dotValue}<br>`;
    
            L.DomEvent.disableClickPropagation(container);
    
            const control = L.control({ position });
            control.onAdd = () => container;
            control.addTo(map);
    
            return () => {
                // Cleanup on component unmount
                control.remove();
            };
        }, [position, dotColor, dotSize, dotValue]);
    
        return null;
    };
    
    //------------------------------------------Graduated Symbol Map------------------------------------------------// 
    const ProportionalSymbol = ({data, scale, symbolColor}) =>{
        const map = useMap();
        markerGroup.clearLayers();
        function scaleRadius(value) {
            var radius = 1;
            for (var i = 0; i< scale.length; i++){
                if (value >= scale[i].value)
                    radius = scale[i].radius
            }
            return radius;
        };
        if (data){ 
            data.forEach(({latitude,longitude, value}, index) => {
                L.circleMarker(L.latLng(latitude, longitude), { radius: scaleRadius(value), weight: 1, color: symbolColor }).addTo(markerGroup)
            });
        }
        // function calcRadius(val, zoom) {
        //     return 1.00083 * Math.pow(val/20,0.5716) * (zoom / 2);      
        // }
        // map.on('zoomend', function() {
        //     markerGroup.eachLayer(function(layer){
        //         if (layer instanceof L.CircleMarker){
        //             layer.setRadius(calcRadius(layer._orgRadius,map.getZoom()))
        //         }
        //     });
        // });
        markerGroup.addTo(map);
    }
    //--------------------------------------------------------------------------------------------------------------//
    // Flow MAPS
    const deleteArrow = (index) => {
        //when clicked to remove
        let mapLayer = store.currentMapLayer
        console.log(mapLayer);
        console.log(index);
        mapLayer.dataValues.splice(index,1); //removes arrow for dataValues array, it will no longer be spawned, and will disappear when saved and exited
        store.updateCurrentMapLayer(mapLayer);
    }
    const FlowArrows = ({data}) =>{
        arrowGroup.clearLayers();
        if (data){ 
            for(let coordinate of data){
                let originPosition = [coordinate.originLatitude,coordinate.originLongitude];
                let destinationPosition = [coordinate.destinationLatitude,coordinate.destinationLongitude];
                const arrow = (
                    L.polyline([originPosition,destinationPosition],{color:coordinate.colorScale, weight: 3*coordinate.lineSizeScale}).arrowheads()
                )
                arrow.bindTooltip(coordinate.label, {permanent: true})
                .bindPopup(`
                        <button variant="outlined" onclick="deleteArrow(${coordinate.value})">
                            Delete
                        </button>
                        <div>Starting Latitude: ${coordinate.originLatitude}</div>
                        <div>Starting Longitude: ${coordinate.originLongitude}</div>
                        <div>Destination Latitude: ${coordinate.destinationLatitude}</div>
                        <div>Destination Longitude: ${coordinate.destinationLongitude}</div>
                        <input type="text" id="newOriLat" placeholder="New Starting Latitude"/>
                        <input type="text" id="newOriLng" placeholder="New Starting Longitude"/>
                        <input type="text" id="newEndLat" placeholder="New Destination Latitude"/>
                        <input type="text" id="newEndLng" placeholder="New Destination Longitude"/>
                        <input type="color" id="newColor" placeholder="New Color"/>
                        <input type="text" id="newLabel" placeholder="New Label"/>
                        <input type="text" id="newSize" placeholder="New Line Width"/>
                        <button onclick="updateCoordinates(${coordinate.originLatitude}, ${coordinate.originLongitude}, ${coordinate.destinationLatitude}, ${coordinate.destinationLongitude})">Update</button>`)
                .on('popupopen', function() {
                    window.updateCoordinates = function(currentOriLat, currentOriLng, currentEndLat, currentEndLng, currentColor, currentSize) {
                        const newOriLat = document.getElementById('newOriLat').value;
                        const newOriLng = document.getElementById('newOriLng').value;
                        const newEndLat = document.getElementById('newEndLat').value;
                        const newEndLng = document.getElementById('newEndLng').value;
                        const newColor = document.getElementById('newColor').value;
                        const newLabel = document.getElementById('newLabel').value;
                        const newSize = document.getElementById('newSize').value;
                        console.log(`Update coordinates from (${currentOriLat}, ${currentOriLng}) and (${currentEndLat}, ${currentEndLng}) to (${newOriLat}, ${newOriLng}) and (${newEndLat}, ${newEndLng})`);

                        let originPosition = [newOriLat,newOriLng];
                        let destinationPosition = [newEndLat,newEndLng];
                        let prev = _.cloneDeep(store.currentMapLayer);
                        arrow.setLatLngs([originPosition, destinationPosition]);
                        console.log(arrow._latlngs);
                        coordinate.originLatitude = newOriLat;
                        coordinate.originLongitude = newOriLng;
                        coordinate.destinationLatitude = newEndLat;
                        coordinate.destinationLongitude = newEndLng;
                        coordinate.colorScale = newColor;
                        coordinate.label = newLabel;
                        coordinate.lineSizeScale = newSize;
                        arrowGroup.clearLayers();
                        console.log(prev);
                        store.addUpdateLayerTransaction(prev);
                    };
                })
                .on('popupopen', function(){
                    window.deleteArrow = function(index){
                        //when clicked to remove
                        let mapLayer = store.currentMapLayer
                        console.log(mapLayer);
                        console.log(index);
                        mapLayer.dataValues.splice(index,1); //removes arrow for dataValues array, it will no longer be spawned, and will disappear when saved and exited
                        store.updateCurrentMapLayer(mapLayer);
                    }
                }) 
                .addTo(arrowGroup);
                console.log(arrow);
            }
        }
        arrowGroup.addTo(map);
    }
    //const flowArrows = [<FlowArrow position={[[50.71277, -74.00597], [49.95258, -75.16522]]} lineSize={1} color={'orange'}/>,<FlowArrow position={[[40.71277, -74.00597], [39.95258, -75.16522]]} lineSize={1} color={'orange'}/>];
    //-------------------------------------------------------------------------------------------------------------//

    //-------------------------------------------------------------------------------------------------------------//
    // HEAT MAP
    let check = 0;
    const HeatMapLayer = ({editActive}) => {
        const map = useMap();
    
        // Remove existing heat layer if it exists
        if (heatLayerRef.current) {
            // console.log("REMOVING HEAT LAYER");
            map.removeLayer(heatLayerRef.current);
        }

        let colorGradience = store.currentMapLayer.colorScale;

        heatLayerRef.current = L.heatLayer(store.currentMapLayer.dataValues, {
            minOpacity: 1,
            radius: 10,
            max: 1.0,
            blur: 15,
            gradient: {
                0.0: colorGradience.low ? colorGradience.low : 'blue',
                0.5: colorGradience.medium ? colorGradience.medium : 'yellow',
                1.0: colorGradience.high ? colorGradience.high : 'red'
            }
            
        }).addTo(map);


        // let editActive = store.heatmapEditActive;

        map.on({
            click: function (e) {
                // let editActive = store.heatmapEditActive;
                console.log("EDITACTIVE: " + editActive + check);
                check++;
                if (editActive) {
                    let mapLayer = store.currentMapLayer;
                    mapLayer.dataValues.push(e.latlng);
                    console.log(mapLayer);
                    store.updateCurrentMapLayer(mapLayer);
                }
            }
        })
    
        return null;

    }



    return (
        <MapContainer
            center={[0, 0]}
            zoom={2}
            zoomControl={false}
            scrollWheelZoom={true}
            style={style ? style : { height: '83vh'}}
            ref={setMap}
            onClick={getLatLang}
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
            {store.mapTemplate === 'heatMap' && <HeatMapLayer editActive={store.heatmapEditActive}/>}
            {store.mapTemplate === 'dotDensityMap' && (
                <DotLegend
                    position="topleft"
                    dotColor={store.currentMapLayer.dotColor}
                    dotSize={store.currentMapLayer.dotSize}
                    dotValue={store.currentMapLayer.dotValue}
                    valueField={store.currentMapLayer.valueField}
                />
            )}
            {store.mapTemplate === 'flowMap' && <FlowArrows data={store.currentMapLayer.dataValues}/>/*<FlowArrow position={[[store.currentMapLayer.dataValues[0].originLatitude,store.currentMapLayer.dataValues[0].originLongitude], [store.currentMapLayer.dataValues[0].destinationLatitude,store.currentMapLayer.dataValues[0].destinationLongitude]]} lineSize={1} color={'red'}/>*/}
            {/* Render dots only if mapType is "dotDensityMap" */}
            {store.mapTemplate === 'graduatedSymbolMap' && <ProportionalSymbol data = {store.currentMapLayer.dataValues} scale = {store.currentMapLayer.sizeScale} symbolColor = {store.currentMapLayer.symbolColor} />}
        </MapContainer>

    );
};

export default MapWrapper;
