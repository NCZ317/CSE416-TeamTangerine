
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

    const [arrowDataslat, setArrowDataslat] = useState("");
    const [arrowDataslng, setArrowDataslng] = useState("");
    const [arrowDataelat, setArrowDataelat] = useState("");
    const [arrowDataelng, setArrowDataelng] = useState("");
    const [valueField, setValueField] = useState("");
    const [storeChanged, setChanged] = useState(false);

    const currentMap = store.currentMap.jsonData; 
    const properties = currentMap.features.map(x => x.properties);
    const handleTabChange = (event, newValue) => {
        console.log(store.currentMapLayer)
        setSelectedTab(newValue);
    };

    const handleDataSettings = () => {
        setDataSettingsOpen(!dataSettingsOpen);
    };

    const handleStartClick = (event) => {
        
    }
    const handleArrowData = (event,type) => {
        if (event.key === "Enter") {
            console.log("VALUE:\n" + arrowDataslat +", "+arrowDataslng +"\n"+arrowDataelat +", "+arrowDataelng);
            let mapLayer = store.currentMapLayer;
            console.log(mapLayer)
            
            //mapLayer.dataValues = [parseFloat(arrowDataslat),parseFloat(arrowDataslng),parseFloat(arrowDataelat),parseFloat(arrowDataelng)];
            mapLayer.dataValues = [{
                originLatitude: parseFloat(arrowDataslat),
                originLongitude: parseFloat(arrowDataslng),
                destinationLatitude: parseFloat(arrowDataelat),
                destinationLongitude: parseFloat(arrowDataelng),
                value: 0//index
            }]
            store.updateCurrentMapLayer(mapLayer);
            console.log(store.currentMapLayer);
            setChanged(true);
            //updateMapLayer
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
    console.log(properties);
    console.log(store.currentMapLayer);
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
                        <Typography style={{fontSize: '16px'}}>Click the button below, then type the latitude and longitudes to create arrow(Doesn't exist yet)</Typography>
                        <Typography style={{fontSize: '16px'}}>Press Enter after entering in each text box; clicking out of the textbox will cause errors</Typography>
                        {
                            <div style={{display: 'flex'}}>
                                <div style={{width: '50%', paddingTop: '5%'}}>{'startLat\nstartLng'}</div>
                                <div>
                                    <TextField
                                        // label={property.value}
                                        defaultValue={null}
                                        // onChange = {(e) => (property.value =  e.target.value)}
                                        onChange={(e) => setArrowDataslat(e.target.value)}
                                        onKeyDown={(e) => handleArrowData(e)}
                                    />
                                    <TextField
                                        // label={property.value}
                                        defaultValue={null}
                                        // onChange = {(e) => (property.value =  e.target.value)}
                                        onChange={(e) => setArrowDataslng(e.target.value)}
                                        onKeyDown={(e) => handleArrowData(e)}
                                    />
                                </div>
                                <div style={{width: '50%', paddingTop: '5%'}}>{'endLat\nendLng'}</div>
                                <div>
                                    <TextField
                                        // label={property.value}
                                        defaultValue={null}
                                        // onChange = {(e) => (property.value =  e.target.value)}
                                        onChange={(e) => setArrowDataelat(e.target.value)}
                                        onKeyDown={(e) => handleArrowData(e)}
                                    />
                                    <TextField
                                        // label={property.value}
                                        defaultValue={null}
                                        // onChange = {(e) => (property.value =  e.target.value)}
                                        onChange={(e) => setArrowDataelng(e.target.value)}
                                        onKeyDown={(e) => handleArrowData(e)}
                                    />
                                </div>
                            </div>
                            
                        }
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
