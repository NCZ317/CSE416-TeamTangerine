// ChoroplethToolbox.js

import React, { useState, useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, IconButton, Checkbox, FormGroup, FormControlLabel, Collapse, Switch, ToggleButton } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Divider from '@mui/material/Divider';
import MapSettings from './MapSettings';

import { GlobalStoreContext } from '../store';

const HeatmapToolbox = () => {

    const { store } = useContext(GlobalStoreContext);

    const [selectedTab, setSelectedTab] = useState(0);

    const [legend, setLegend] = useState([{ value: '', color: '' }]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleIntensityChange = (event, intensity) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.colorScale[intensity] = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    };


    return (
        <div className="heatmap-toolbox">
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

                    <Typography variant='h6' style={{marginTop: 20, textAlign: 'center'}}>Click the Edit Icon to Add Heat Points</Typography>
                    <Box style={{display: 'flex', justifyContent: 'space-evenly', marginTop: 20}}> 

                        <ToggleButton
                                style={{
                                    backgroundColor: store.heatmapEditActive ? '#4caf50' : '#ccc',
                                    color: store.heatmapEditActive ? '#fff' : '#333',
                                }}
                                selected={store.heatmapEditActive}
                                onChange={() => {
                                    store.setHeatmapEditActive(!store.heatmapEditActive);
                                }}
                            >
                            <ModeEditIcon />
                        </ToggleButton>

                    </Box>


                    <Divider style={{borderBottom: '2px solid black', margin: 10}} />

                    <Typography variant='h6' style={{margin: 20, textAlign: 'center'}}>Intensity Color Gradience</Typography>


                    <div style={{display: 'flex', marginBottom: 20}}>
                        
                        <TextField
                            label="Low Intensity"
                            type="color"
                            fullWidth
                            defaultValue={store.currentMapLayer.colorScale.low}
                            onChange={(e) => handleIntensityChange(e, 'low')}
                        />
                    </div>

                    <div style={{display: 'flex', marginBottom: 20}}>
                        
                        <TextField
                            label="Medium Intensity"
                            type="color"
                            fullWidth
                            defaultValue={store.currentMapLayer.colorScale.medium}
                            onChange={(e) => handleIntensityChange(e, 'medium')}
                        />
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        
                        <TextField
                            label="High Intensity"
                            type="color"
                            fullWidth
                            defaultValue={store.currentMapLayer.colorScale.high}
                            onChange={(e) => handleIntensityChange(e, 'high')}
                        />
                    </div>


                </div>
            )}

            {selectedTab === 1 && (
                <MapSettings/>
            
            )}

        </div>
    );
};

export default HeatmapToolbox;


