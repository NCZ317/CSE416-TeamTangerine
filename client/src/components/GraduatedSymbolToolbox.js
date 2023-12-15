import React, { useState, useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import { MultiPolygon } from 'react-leaflet';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, IconButton, Checkbox, FormGroup, FormControlLabel, Collapse, Switch, Popover } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import MapSettings from './MapSettings';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import * as turf from '@turf/turf';
import _ from 'lodash'; 

import { GlobalStoreContext } from '../store';

const GraduatedSymbolToolbox = () => {
    const { store } = useContext(GlobalStoreContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [geometry, setGeometry] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const [selectedTab, setSelectedTab] = useState(0);
    const [dataSettingsOpen, setDataSettingsOpen] = useState(true);
    const [mapSettingsOpen, setMapSettingsOpen] = useState(true);

    const [data, setData] = useState([{latitude: 0, longitude: 0, value: 0}])
    const [legend, setLegend] = useState([{ value: 0, radius: 0 }]);


    const [properties, setProperties] = useState([]);
    //console.log(properties);
    useEffect(() => {
        //console.log("GRADUATED SYMBOL TOOLBOX LISTENER");
        if (store.currentMapLayer) {
            if (store.currentMapLayer.dataValues) {
                //console.log(store.currentMapLayer.dataValues);
                setProperties(store.currentMapLayer.dataValues);
            }
        }
    }, [store.currentMapLayer]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleDataSettings = () => {
        setDataSettingsOpen(!dataSettingsOpen);
    };

    const addDataRow = () => {
        setData([...data, { latitude: 0, longitude: 0, intensity: '' }]);
    };

    const handleLatData = (index, latitude) => {
        const newData = [...data];
        newData[index].latitude = latitude;
        setData(newData);
    };
    const handleLongData = (index, longitude) => {
        const newData = [...data];
        newData[index].longitude = longitude;
        setData(newData);
    };
    const handleDataValue = (index, value) => {
        const newData = [...data];
        newData[index].value = value;
        setData(newData);
    };
    const deleteDataRow = (index) => {
        const newData = [...data];
        newData.splice(index, 1);
        let mapLayer = store.currentMapLayer;
        mapLayer.dataValues = newData;
        store.updateCurrentMapLayer(mapLayer);
        setData(newData);
    };

    const handleMapSettings = () => {
        setMapSettingsOpen(!mapSettingsOpen);
    }

    const addLegendRow = () => {
        setLegend([...legend, { value: 0, radius: 0 }]);
    };

    const handleLegendValue = (index, value) => {
        const newLegend = [...legend];
        newLegend[index].value = value;
        setLegend(newLegend);
    };

    const handleLegendRadius = (index, radius) => {
        const newLegend = [...legend];
        newLegend[index].radius = radius;
        setLegend(newLegend);
    };

    const deleteLegendRow = (index) => {
        const newLegend = [...legend];
        newLegend.splice(index, 1);
        setLegend(newLegend);
    };

    const handleSymbolColor = (color) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.symbolColor = color;
        store.updateCurrentMapLayer(mapLayer);
    }

    const saveData = () =>{
        let mapLayer = store.currentMapLayer;
        mapLayer.dataValues = data;
        store.updateCurrentMapLayer(mapLayer);
    }

    const saveLegend = () => {
        let mapLayer = store.currentMapLayer;
        mapLayer.sizeScale = legend;
        store.updateCurrentMapLayer(mapLayer);
    }

    const handleAddSymbol = () => {
        console.log("ADDING SYMBOL");
        let point = turf.pointOnFeature(store.currentMap.jsonData);
        console.log(point.geometry.coordinates);
        if (store.currentMapLayer) {
            let prev = _.cloneDeep(store.currentMapLayer);
            let coords = turf.getCoord(point);
            console.log(coords);
            store.currentMapLayer.dataValues.push({
                coordinates: coords,
                radius: 10
            });
            store.addUpdateLayerTransaction(prev); 
        }
    }

    return (
        <div className="dotdensity-toolbox">
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            >
                <Tab label="Data" />
                <Tab label="Settings" />
            </Tabs>

            {selectedTab === 0 && (
                <div>
                    <IconButton onClick={handleDataSettings} aria-label="toggle" sx={{width: '100%'}}>
                        Symbol Settings
                        {dataSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={dataSettingsOpen} timeout="auto" unmountOnExit
                        sx={{ width: '95%', p: 1, textAlign: 'center' }}
                    >
                        <Button
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                            variant='contained'
                            fullWidth
                            style={{ marginBottom: '24px' }}
                            onClick={handleAddSymbol}
                        >
                            <AddLocationIcon />
                        </Button>
                        <Popover
                            id="mouse-over-popover"
                            sx={{
                                pointerEvents: 'none',
                            }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <Typography sx={{ p: 1 }}>Click to use the Symbol Creator. I add a symbol to the map and you can edit the details below</Typography>
                        </Popover>
                        {properties.map((row, index) => (
                            <div key={index} style={{display: 'flex', marginBottom: '12px'}}>
                                <TextField
                                    label="Latitude"
                                    value={row.coordinates[1]}
                                    fullWidth
                                    type='number'
                                    InputProps={{
                                        inputProps: {
                                            step: 1
                                        },

                                    }}
                                    onChange={(e) => {
                                        let prev = _.cloneDeep(store.currentMapLayer);
                                        const newLat = e.target.value;
                                        if (store.currentMapLayer) {
                                            console.log(index);
                                            store.currentMapLayer.dataValues[index].coordinates[1] = newLat;
                                            store.addUpdateLayerTransaction(prev);
                                        }
                                    }}
                                />
                                <TextField
                                    label="Longitude"
                                    value={row.coordinates[0]}
                                    fullWidth
                                    type='number'
                                    InputProps={{
                                        inputProps: {
                                            step: 1
                                        },

                                    }}
                                    onChange={(e) => {
                                        let prev = _.cloneDeep(store.currentMapLayer);
                                        const newLong = e.target.value;
                                        if (store.currentMapLayer) {
                                            console.log(index);
                                            store.currentMapLayer.dataValues[index].coordinates[0] = newLong;
                                            store.addUpdateLayerTransaction(prev);
                                        }
                                    }}
                                />
                                <TextField
                                    label="Radius"
                                    value={row.radius}
                                    fullWidth
                                    type='number'
                                    InputProps={{
                                        inputProps: {
                                            min: 1,
                                            step: 1
                                        },

                                    }}
                                    onChange={(e) => {
                                        let prev = _.cloneDeep(store.currentMapLayer);
                                        const newRadius = e.target.value;
                                        if (store.currentMapLayer) {
                                            console.log(index);
                                            store.currentMapLayer.dataValues[index].radius = newRadius;
                                            store.addUpdateLayerTransaction(prev);
                                        }
                                    }}
                                />
                                <IconButton 
                                    variant="outlined" 
                                    onClick={() => {
                                        let prev = _.cloneDeep(store.currentMapLayer);
                                        if (store.currentMapLayer) {
                                            console.log(index);
                                            store.currentMapLayer.dataValues.splice(index, 1);
                                            store.addUpdateLayerTransaction(prev);
                                        }
                                    }}>
                                    <DeleteIcon/>
                                </IconButton>
                            </div>
                        ))}
                        {/* <Button variant="outlined" onClick={saveData}>
                            Save Data
                        </Button>
                        <Button variant="outlined" onClick={addDataRow}>
                            Add Data Point
                        </Button> */}

                    </Collapse>

                    <IconButton onClick={handleMapSettings} aria-label="toggle" sx={{width: '100%'}}>
                        Map Settings
                        {mapSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={mapSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '95%', p: 1, textAlign: 'center' }}
                    >
                        
                        <TextField 
                            label="Symbol Color"
                            type='color'
                            value = {store.currentMapLayer.symbolColor ? store.currentMapLayer.symbolColor : "#000000"}
                            fullWidth
                            onChange={(e) => {
                                let prev = _.cloneDeep(store.currentMapLayer);
                                const newSymbolColor = e.target.value;
                                if (store.currentMapLayer) {
                                    store.currentMapLayer.symbolColor = newSymbolColor;
                                    store.addUpdateLayerTransaction(prev);
                                }
                            }}
                        />

                        {/* <Divider style={{borderBottom: '2px solid black', margin: 10}} />


                        <Typography variant='h6'>Radius Scale</Typography>
                        {legend.map((row, index) => (
                            <div key={index} style={{display: 'flex'}}>
                                <TextField
                                    label="From"
                                    type='Number'
                                    value={row.value}
                                    fullWidth
                                    onChange={(e) => handleLegendValue(index, e.target.value)}
                                />

                                <TextField
                                    label="Symbol Radius"
                                    type="Number"
                                    value={row.radius}
                                    fullWidth
                                    onChange={(e) => handleLegendRadius(index, e.target.value)}
                                />
                                <IconButton variant="outlined" onClick={() => deleteLegendRow(index)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </div>
                        ))}
                        <Button variant="outlined" onClick={saveLegend}>
                            Save Scale
                        </Button>
                        <Button variant="outlined" onClick={addLegendRow}>
                            Add Scale Value
                        </Button> */}
                    </Collapse>

                </div>
            )}

            {selectedTab === 1 && (
                <MapSettings/>
            
            )}

        </div>
    );
};

export default GraduatedSymbolToolbox;

