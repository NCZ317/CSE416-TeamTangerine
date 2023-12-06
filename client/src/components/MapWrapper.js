import React, { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GlobalStoreContext } from '../store/index.js';
import arrow from './ArrowImage.png';
import testArrow from './ArrowImage2.png'
import L from 'leaflet';
import 'leaflet-imageoverlay-rotated';
import 'leaflet-polylinedecorator';
import 'leaflet-arrowheads';

const MapWrapper = ({ style }) => {
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

    useEffect(() => {
        // console.log(store.currentMap);
        if (store.currentMap && store.currentMap.jsonData) {
            setMapData(store.currentMap.jsonData);
            if (store.currentMap.mapType === 'dotDensityMap') {
                setDotsData(generateDots(store.currentMapLayer.geographicRegion));
                //console.log(dotsData);
            } else setDotsData([]);
        } else {
            setMapData(null);
            setDotsData([]);
        }
    }, [store.currentMap]); // Listen for changes in store.currentMap

    useEffect(() => {
        console.log("CHANGE IN DOTS");
        if (store.currentMap && store.currentMapLayer) {
            if (store.currentMap.mapType === 'dotDensityMap') {
                
                setDotsData(generateDots(store.currentMapLayer.geographicRegion));
            }
        }

    }, [store.currentMapLayer])
    

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
        const clickedLayer = event.target;
        const featureIndex = store.currentMap.jsonData.features.indexOf(feature);
        store.setCurrentRegion(clickedLayer, featureIndex);
    };

    const getLatLang = (event) => {
        console.log("clicked");
        console.log(event);
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

    //THIS FUNCTION IS CALLED EVERY TIME THE MAP IS RENDERED --> RENDERS UPDATED STYLES
    const getMapStyle = (feature) => {
        const featureIndex = store.currentMap.jsonData.features.indexOf(feature);
        const featureFound = store.currentMapLayer.currentRegions.findIndex(region => region.featureIndex === featureIndex);

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
                return {
                    ...mapDataStyle,
                    fillColor: store.currentMapLayer.currentRegions[featureFound].style.fillColor,
                    fillOpacity: store.currentMapLayer.currentRegions[featureFound].style.fillOpacity
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
    const generateDots = (geographicRegion) => {
        //console.log("GENERATING DOTS");
        //console.log(store.mapTemplate);
        const dots = [];

        geographicRegion.forEach((region) => {
            region.dots.forEach((dot) => {
                dots.push({
                    coordinates: dot.coordinates,
                    name: region.name,
                });
            });
        });

        return dots;
    };

    const renderDots = () => {
        //console.log("RENDERING DOTS");
    
        dotsData.forEach((dot, index) => {
            //console.log("ADDING", L.latLng(dot.coordinates[0], dot.coordinates[1]));
            L.circleMarker(L.latLng(dot.coordinates[0], dot.coordinates[1]), { radius: 1, weight: 1, color: 'black' }).addTo(
            map
          )
        });
    };

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
    //--------------------------------------------------------------------------------------------------------------//
    // Flow MAPS
    const FlowArrow=({position, lineSize,color})=> {//position -> [[bottomx,bottomy], [topx,topy]]
        const map = useMap();
        console.log(map);
        useEffect(()=>{
            /* var imageUrl = arrow;
            var altText = 'arrow';
            var size = 0.01*lineSize;
            var bottomAdj    = L.latLng(position[0][0],position[0][1]+size)
            var top   = L.latLng(position[1][0],position[1][1]+size);
            var bottomDia = L.latLng(position[0][0],position[0][1]-size);
            var imageOverlay = L.imageOverlay.rotated(imageUrl, bottomAdj, top, bottomDia, {
                opacity: 0.25*(Math.max(2/lineSize,.4)),
                alt: altText,
                interactive: true
            });
            imageOverlay.addTo(map); */
            console.log(position);
            var arrow = L.polyline(position, {color:color,weight:3*lineSize}).arrowheads();
            arrow.addTo(map);
        },[map,position,lineSize,color])
    }
    //have an array in store holding flow arrow coordinates, lineSize, and color as [[startlat,startlng],[endlat,endlng], linesize, color]
    //console.log(store.currentMapLayer);
    const flowArrows = [];
    if(store.mapTemplate === 'flowMap'){
        console.log(store.currentMapLayer);
        for(let coordinate of store.currentMapLayer.dataValues){
            flowArrows.push(
            <FlowArrow position={[[coordinate.originLatitude,coordinate.originLongitude], [coordinate.destinationLatitude,coordinate.destinationLongitude]]} lineSize={1} color={'red'}/>
            );
        }
    }
    //const flowArrows = [<FlowArrow position={[[50.71277, -74.00597], [49.95258, -75.16522]]} lineSize={1} color={'orange'}/>,<FlowArrow position={[[40.71277, -74.00597], [39.95258, -75.16522]]} lineSize={1} color={'orange'}/>];
    //-------------------------------------------------------------------------------------------------------------//
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
            {store.mapTemplate === 'flowMap' && flowArrows/*<FlowArrow position={[[store.currentMapLayer.dataValues[0].originLatitude,store.currentMapLayer.dataValues[0].originLongitude], [store.currentMapLayer.dataValues[0].destinationLatitude,store.currentMapLayer.dataValues[0].destinationLongitude]]} lineSize={1} color={'red'}/>*/}
            {/* Render dots only if mapType is "dotDensityMap" */}
            {store.mapTemplate === 'dotDensityMap' && renderDots()}

        </MapContainer>

    );
};

export default MapWrapper;
