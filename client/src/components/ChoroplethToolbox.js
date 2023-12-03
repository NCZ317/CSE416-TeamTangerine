// ChoroplethToolbox.js

import React, { useState, useContext } from 'react';
import { Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, IconButton, Checkbox, FormGroup, FormControlLabel, Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import MapSettings from './MapSettings';
import L from 'leaflet';

import { GlobalStoreContext } from '../store';

const ChoroplethToolbox = () => {
    const { store } = useContext(GlobalStoreContext);

    const [selectedTab, setSelectedTab] = useState(0);
    const [dataSettingsOpen, setDataSettingsOpen] = useState(true);
    const [legendSettingsOpen, setLegendSettingsOpen] = useState(false);

    const [regionData, setRegionData] = useState("");
    const [valueField, setValueField] = useState("");

    const [legend, setLegend] = useState(store.currentMapLayer.colorScale);

    const currentMap = store.currentMap.jsonData; 
    const properties = currentMap.features.map(x => x.properties);

    // console.log(legend);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleDataSettings = () => {
        setDataSettingsOpen(!dataSettingsOpen);
    };

    const handleLegendSettings = () => {
        setLegendSettingsOpen(!legendSettingsOpen);
    }

    const handleRegionData = (event, index) => {
        if (event.key === "Enter") {
            console.log("VALUE: " + regionData);
            let map = store.currentMap;
            map.jsonData.features[index].properties.value = regionData;
            store.updateMapData(map);
        }
    }

    const handleValueField = (event) => {
        if (event.key === "Enter") {
            let mapLayer = store.currentMapLayer;
            mapLayer.valueField = valueField;
            store.updateCurrentMapLayer(mapLayer);
        }
    }

    const addLegendRow = () => {
        setLegend([...legend, { value: '', color: store.currentMapLayer.defaultColor }]);
    };

    const handleLegendValue = (index, value) => {
        const newLegend = [...legend];
        newLegend[index].value = value;
        setLegend(newLegend);
    };

    const handleLegendColor = (index, color) => {
        const newLegend = [...legend];
        newLegend[index].color = color;

        let mapLayer = store.currentMapLayer;
        mapLayer.colorScale = newLegend;
        store.updateCurrentMapLayer(mapLayer);
        setLegend(newLegend);
    };

    const deleteLegendRow = (index) => {
        const newLegend = [...legend];
        newLegend.splice(index, 1);
        // store.currentMap.legend = newLegend;
        // setLegend(newLegend);
        let mapLayer = store.currentMapLayer;
        mapLayer.colorScale = newLegend;
        store.updateCurrentMapLayer(mapLayer);
        setLegend(newLegend);
    };

    const updateLegendValue = (event, index) => {
        if (event.key === "Enter") {

            if (event.target.value === "") {
                const newLegend = [...legend];
                newLegend[index].value = "";
                newLegend[index].color = store.currentMapLayer.defaultColor;     //CHANGE IT TO DEFAULT VALUE WHEN USER CLEARS LEGEND VALUE
                
                let mapLayer = store.currentMapLayer;
                mapLayer.colorScale = newLegend;
                store.updateCurrentMapLayer(mapLayer);
                setLegend(newLegend);

            } else {
                let mapLayer = store.currentMapLayer;
                mapLayer.colorScale = legend;
                store.updateCurrentMapLayer(mapLayer);

            }

        }
    }

    const handleDefaultColor = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.defaultColor = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }


    return (
        <div className="choropleth-toolbox">
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
                        Data Settings
                        {dataSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={dataSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >
                        <Typography style={{fontSize: '16px'}}>Change text and press enter to change values</Typography>
                        <Typography style={{fontSize: '16px'}}>Clicking out of text box without pressing enter will cause errors</Typography>
                        {properties.map((property, index) => (
                            <div style={{display: 'flex'}} value = {property.name}>
                                <div style={{width: '50%', paddingTop: '5%'}}>{property.name || `Region ${index}`}</div>
                                <TextField
                                    // label={property.value}
                                    defaultValue={property.value}
                                    // onChange = {(e) => (property.value =  e.target.value)}
                                    onChange={(e) => setRegionData(e.target.value)}
                                    onKeyDown={(e) => handleRegionData(e, index)}
                                />
                                {/* <IconButton variant="outlined">
                                    <DeleteIcon/>
                                </IconButton> */}
                            </div>
                        ))}
                    </Collapse>

                    <IconButton onClick={handleLegendSettings} aria-label="toggle" sx={{width: '100%'}}>
                        Legend Settings
                        {legendSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={legendSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >
                        <Box style={{p: 5}}>
                            <TextField
                                label="Data Description (ex. population, gdp, etc.)"
                                onChange={(e) => setValueField(e.target.value)}
                                onKeyDown={handleValueField}
                                defaultValue={store.currentMapLayer.valueField}
                                fullWidth
                            />
                            <TextField
                                label="Default Map Color"
                                type='color'
                                style={{marginTop: 20}}
                                fullWidth
                                defaultValue={store.currentMapLayer.defaultColor}
                                onChange={handleDefaultColor}
                            />
                        </Box>
                        

                        <Divider style={{borderBottom: '2px solid black', margin: 10}} />

                        <Typography style={{fontSize: '16px'}}>For numeric data, add start value in decreasing order</Typography>
                        <Typography style={{fontSize: '16px'}}>For categorical data, add the category name and its corresponding color</Typography>
                        <br></br>
                        {legend.map((row, index) => (
                            <div key={index} style={{display: 'flex'}}>
                                <TextField
                                    label="From"
                                    value={row.value}
                                    fullWidth
                                    onChange={(e) => handleLegendValue(index, e.target.value)}
                                    onKeyDown={(e) => updateLegendValue(e, index)}
                                />
                                <TextField
                                    label="Color"
                                    type="color"
                                    value={row.color}
                                    fullWidth
                                    onChange={(e) => handleLegendColor(index, e.target.value)}
                                />
                                <IconButton variant="outlined" onClick={() => deleteLegendRow(index)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </div>
                        ))}
                        <Button variant="outlined" onClick={addLegendRow}>
                            Add Legend
                        </Button>

                    </Collapse>

                </div>
            )}

            {selectedTab === 1 && (
                <MapSettings />
            
            )}

        </div>
    );
};

export default ChoroplethToolbox;
