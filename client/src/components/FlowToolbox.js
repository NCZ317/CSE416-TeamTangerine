
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

const FlowToolbox = () => {
    const { store } = useContext(GlobalStoreContext);

    const [selectedTab, setSelectedTab] = useState(0);
    const [dataSettingsOpen, setDataSettingsOpen] = useState(true);

    const [regionData, setRegionData] = useState("");
    const [valueField, setValueField] = useState("");


    const currentMap = store.currentMap.jsonData; 
    const properties = currentMap.features.map(x => x.properties);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleDataSettings = () => {
        setDataSettingsOpen(!dataSettingsOpen);
    };


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


    const handleDefaultColor = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.defaultColor = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }


    return (
        <div className="flow-toolbox">
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
                        Arrows
                        {dataSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={dataSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >
                        <Typography style={{fontSize: '16px'}}>Click the button below, then click twice on map to create arrow(Doesn't exist yet)</Typography>
                        <Typography style={{fontSize: '16px'}}>First click to select starting point, second click to select ending point</Typography>
                        {/* {properties.map((property, index) => (
                            <div style={{display: 'flex'}} value = {property.name}>
                                <div style={{width: '50%', paddingTop: '5%'}}>{property.name || `Region ${index}`}</div>
                                <TextField
                                    // label={property.value}
                                    defaultValue={property.value}
                                    // onChange = {(e) => (property.value =  e.target.value)}
                                    onChange={(e) => setRegionData(e.target.value)}
                                    onKeyDown={(e) => handleRegionData(e, index)}
                                />
                            </div>
                        ))} */}
                    </Collapse>

                </div>
            )}

            {selectedTab === 1 && (
                <MapSettings />
            
            )}

        </div>
    );
};

export default FlowToolbox;
