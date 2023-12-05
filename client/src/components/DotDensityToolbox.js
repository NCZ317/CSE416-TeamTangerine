
import React, { useState,useContext } from 'react';
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
import GlobalStoreContext from '../store';

const DotDensityToolbox = () => {
    const { store } = useContext(GlobalStoreContext);

    const [selectedTab, setSelectedTab] = useState(0);
    const [dataSettingsOpen, setDataSettingsOpen] = useState(true);
    const [mapSettingsOpen, setMapSettingsOpen] = useState(true);

    const [legend, setLegend] = useState([{ value: '', description: '', color: '' }]);

    const currentMap = store.currentMap.jsonData; 
    const properties = currentMap.features.map((feature, index) => ({
        id: index,
        name: feature.properties.name,
    }));
    const [dotCounts, setDotCounts] = useState(properties.reduce((acc, property) => {
        acc[property.name] = 10;
        return acc;
    }, {}));

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleDataSettings = () => {
        setDataSettingsOpen(!dataSettingsOpen);
    };

    const handleMapSettings = () => {
        setMapSettingsOpen(!mapSettingsOpen);
    }

    const addLegendRow = () => {
        setLegend([...legend, { category: '', color: '' }]);
    };

    const handleLegendValue = (index, category) => {
        const newLegend = [...legend];
        newLegend[index].category = category;
        setLegend(newLegend);
    };

    const handleLegendDescription = (index, description) => {
        const newLegend = [...legend];
        newLegend[index].description = description;
        setLegend(newLegend);
    };

    const handleLegendColor = (index, color) => {
        const newLegend = [...legend];
        newLegend[index].color = color;
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
                        {properties.map((property) => (
                            <div style={{display: 'flex', marginTop: '12px'}} value = {property.name}>
                                <div style={{width: '50%', paddingTop: '5%'}}>{property.name || `Region ${property.index}`}</div>
                                <TextField
                                    label="Dot Count"
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                          min: 0,
                                          step: 1
                                        },
                                    }}
                                    value={dotCounts[property.name]}
                                    onChange={(e) => setDotCounts({ ...dotCounts, [property.name]: e.target.value })}
                                />
                            </div>
                        ))}

                    </Collapse>

                    <IconButton onClick={handleMapSettings} aria-label="toggle" sx={{width: '100%'}}>
                        Map Settings
                        {mapSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={mapSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >
                        <Box style={{display: 'flex'}}>
                            <TextField 
                                label="Dot Size"
                                type='Number'
                            />
                            <TextField 
                                label="Value per Dot"
                                type='Number'
                            />

                        </Box>

                        <FormGroup>
                            <FormControlLabel control={<Switch defaultChecked />} label="Show Legend" />
                        </FormGroup>

                        <Divider style={{borderBottom: '2px solid black', margin: 10}} />


                        <Typography variant='h6'>Category Color Scale</Typography>
                        {legend.map((row, index) => (
                            <div key={index} style={{display: 'flex'}}>
                                <TextField
                                    label="Category"
                                    value={row.category}
                                    fullWidth
                                    onChange={(e) => handleLegendValue(index, e.target.value)}
                                />
                                <TextField
                                    label="Description"
                                    value={row.description}
                                    fullWidth
                                    onChange={(e) => handleLegendDescription(index, e.target.value)}
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
                            Add Category
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

export default DotDensityToolbox;

