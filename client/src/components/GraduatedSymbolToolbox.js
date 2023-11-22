
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, IconButton, Checkbox, FormGroup, FormControlLabel, Collapse, Switch } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import MapSettings from './MapSettings';

const GraduatedSymbolToolbox = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [dataSettingsOpen, setDataSettingsOpen] = useState(true);
    const [mapSettingsOpen, setMapSettingsOpen] = useState(true);

    const [data, setData] = useState([{lat: 0, long: 0, value: 0}])
    const [legend, setLegend] = useState([{ value: 0, radius: 0 }]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleDataSettings = () => {
        setDataSettingsOpen(!dataSettingsOpen);
    };

    const addDataRow = () => {
        setData([...data, { lat: 0, long: 0, intensity: '' }]);
    };

    const handleLatData = (index, latitude) => {
        const newData = [...data];
        newData[index].lat = latitude;
        setData(newData);
    };
    const handleLongData = (index, longitude) => {
        const newData = [...data];
        newData[index].long = longitude;
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
                        Data Settings
                        {dataSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={dataSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >

                        {data.map((row, index) => (
                            <div key={index} style={{display: 'flex'}}>
                                <TextField
                                    label="Latitude"
                                    value={row.lat}
                                    fullWidth
                                    onChange={(e) => handleLatData(index, e.target.value)}
                                />
                                <TextField
                                    label="Longitude"
                                    value={row.long}
                                    fullWidth
                                    onChange={(e) => handleLongData(index, e.target.value)}
                                />
                                <TextField
                                    label="Value"
                                    value={row.value}
                                    fullWidth
                                    onChange={(e) => handleDataValue(index, e.target.value)}
                                />
                                <IconButton variant="outlined" onClick={() => deleteDataRow(index)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </div>
                        ))}
                        <Button variant="outlined" onClick={addDataRow}>
                            Add Data Point
                        </Button>

                    </Collapse>

                    <IconButton onClick={handleMapSettings} aria-label="toggle" sx={{width: '100%'}}>
                        Map Settings
                        {mapSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={mapSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >
                        
                        <TextField 
                            label="Symbol Color"
                            type='color'
                            fullWidth
                        />

                        <Divider style={{borderBottom: '2px solid black', margin: 10}} />


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
                        <Button variant="outlined" onClick={addLegendRow}>
                            Add Scale Value
                        </Button>

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
