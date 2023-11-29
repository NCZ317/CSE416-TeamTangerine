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
    const [legendSettingsOpen, setLegendSettingsOpen] = useState(true);
    var leg = []
    if(store.currentMap.legend){
       leg = store.currentMap.legend;}
    else leg =[{ value: '', color: '' }];

    const [legend, setLegend] = useState(leg);

    
    const currentMap = store.currentMap.jsonData; 
    const features = currentMap.features.map(x => x.properties);
    console.log(legend);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleDataSettings = () => {
        setDataSettingsOpen(!dataSettingsOpen);
    };

    const handleLegendSettings = () => {
        setLegendSettingsOpen(!legendSettingsOpen);
    }

    const addLegendRow = () => {
        setLegend([...legend, { value: '', color: '' }]);
    };

    const handleLegendValue = (index, value) => {
        const newLegend = [...legend];
        newLegend[index].value = value;
        console.log(store.currentMap.legend);
        store.currentMap.legend = newLegend;
        console.log(store.currentMap.legend);
        console.log(store.currentMap.mapType);
        setLegend(newLegend);
    };

    const handleLegendColor = (index, color) => {
        const newLegend = [...legend];
        newLegend[index].color = color;
        store.currentMap.legend = newLegend;
        setLegend(newLegend);
    };

    const deleteLegendRow = (index) => {
        const newLegend = [...legend];
        newLegend.splice(index, 1);
        store.currentMap.legend = newLegend;
        setLegend(newLegend);
    };

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
                        {features.map((property, index) => (
                            <div style={{display: 'flex'}} value = {property.name}>
                                <div style={{width: '50%', paddingTop: '5%'}}>{property.name}</div>
                                <TextField
                                    label={property.value}
                                    onChange = {(e) => (property.value =  e.target.value)}
                                />
                                <IconButton variant="outlined">
                                    <DeleteIcon/>
                                </IconButton>
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
                        <TextField
                            label="Data Type (ex. population, gdp, etc.)"
                            fullWidth
                        />

                        <Divider style={{borderBottom: '2px solid black', margin: 10}} />

                        <Typography>For numeric data, add the starting value for each color</Typography>
                        <Typography>For categorical data, add the category name and its corresponding color</Typography>

                        {legend.map((row, index) => (
                            <div key={index} style={{display: 'flex'}}>
                                <TextField
                                    label="From"
                                    value={row.value}
                                    fullWidth
                                    onChange={(e) => handleLegendValue(index, e.target.value)}
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
