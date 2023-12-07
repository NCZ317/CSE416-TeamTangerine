
import React, { useState,useContext, useEffect } from 'react';
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
import * as turf from '@turf/turf';

const DotDensityToolbox = () => {
    const { store } = useContext(GlobalStoreContext);

    const [selectedTab, setSelectedTab] = useState(0);
    const [dataSettingsOpen, setDataSettingsOpen] = useState(true);
    const [mapSettingsOpen, setMapSettingsOpen] = useState(true);

    const [legend, setLegend] = useState([{ value: '', description: '', color: '' }]);

    
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        console.log("DOT DENSITY TOOLBOX LISTENER");
        if (store.currentMapLayer) {
            if (store.currentMapLayer.geographicRegion) {
                console.log(store.currentMapLayer.geographicRegion);
                setProperties(store.currentMapLayer.geographicRegion);
            }
        }
    }, [store.currentMapLayer]);

    

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

    const updateDotCount = (regionName, newDotCount) => {
        if (store.currentMapLayer && store.currentMapLayer.geographicRegion) {
            let region;
            for (let i = 0; i < store.currentMapLayer.geographicRegion.length; i++) {
                if (regionName === store.currentMapLayer.geographicRegion[i].name) {
                    console.log("FOUND REGION")
                    region = store.currentMapLayer.geographicRegion[i];
                }
            }
            console.log(region);
            console.log(newDotCount);
            let diff = newDotCount - region.dots.length;
            console.log(diff);
            if (diff < 0) {
                region.dots.splice(newDotCount);
                console.log(region);
                store.updateCurrentMapLayer(store.currentMapLayer);
            }
            else if (diff > 0) {
                store.currentMap.jsonData.features.forEach((feature) => {
                    const name = feature.properties.name || `Region ${feature.index}`;
            
                    // Check if the current feature's name matches the specified regionName
                    if (name === regionName) {
                        // Get the polygon geometry of the region
                        const regionPolygon = feature.geometry;
            
                        // Generate random dots for the specified region using Turf.js
                        const dots = Array.from({ length: diff }, () => {
                            let randomPoint;
            
                            // Ensure that the generated point is within the region's polygon
                            do {
                                // Get the bounding box of the region geometry
                                const bbox = turf.bbox(regionPolygon);
            
                                // Generate random coordinates within the bounding box
                                const randomLng = bbox[0] + Math.random() * (bbox[2] - bbox[0]);
                                const randomLat = bbox[1] + Math.random() * (bbox[3] - bbox[1]);
            
                                // Create a Turf.js point geometry
                                randomPoint = turf.point([randomLng, randomLat]);
                                if (turf.booleanPointInPolygon(randomPoint, regionPolygon)) break;
            
                                // Check if the point is inside the region's polygon
                            } while (!turf.booleanPointInPolygon(randomPoint, regionPolygon));
            
                            return {
                                coordinates: turf.getCoord(randomPoint),
                            };
                        });
                        region.dots.push(...dots);
                    }
                });
                console.log(region);
                store.updateCurrentMapLayer(store.currentMapLayer);
            }
        }
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
                                type='number'
                                InputProps={{
                                    inputProps: {
                                      min: 1,
                                      step: 1
                                    },
                                    
                                }}
                                value={store.currentMapLayer ? store.currentMapLayer.dotSize : 1}
                                onChange={(e) => {
                                    const newDotSize = e.target.value;
                                    if (store.currentMapLayer) {
                                        store.currentMapLayer.dotSize = newDotSize;
                                        store.updateCurrentMapLayer(store.currentMapLayer);
                                    }
                                }}
                            />
                            <TextField 
                                label="Value per Dot"
                                type='number'
                                InputProps={{
                                    inputProps: {
                                      min: 0,
                                      step: 1
                                    },
                                    
                                }}
                                value = {store.currentMapLayer ? store.currentMapLayer.dotValue : 0}
                            />

                        </Box>
                        <TextField
                            label="Dot Color"
                            type="color"
                            value={store.currentMapLayer ? store.currentMapLayer.dotColor : '#000000'}
                            fullWidth
                            style={{marginTop: '12px'}}
                            onChange={(e) => {
                                const newDotColor = e.target.value;
                                if (store.currentMapLayer) {
                                    store.currentMapLayer.dotColor = newDotColor;
                                    store.updateCurrentMapLayer(store.currentMapLayer);
                                }
                            }}
                        />
                        <FormGroup>
                            <FormControlLabel control={<Switch defaultChecked />} label="Show Legend" />
                        </FormGroup>

                        {/*<Divider style={{borderBottom: '2px solid black', margin: 10}} />


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
                        </Button> */}

                    </Collapse>
                    <IconButton onClick={handleDataSettings} aria-label="toggle" sx={{width: '100%'}}>
                        Data Settings
                        {dataSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={dataSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >
                        {properties.map((property) => (
                            <div style={{display: 'flex', marginTop: '12px'}} value = {property.name}>
                                <div style={{width: '50%', paddingTop: '5%'}}>{property.name }</div>
                                <TextField
                                    label="Dot Count"
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                          min: 0,
                                          step: 1
                                        },
                                        
                                    }}
                                    value={property.dots.length}
                                    onChange={(e) => updateDotCount(property.name, e.target.value)}
                                />
                            </div>
                        ))}

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

