import React, { useState, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconButton, Checkbox, FormGroup, FormControlLabel, Collapse, Switch, Menu, MenuItem } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import _ from 'lodash'; 

import { GlobalStoreContext } from '../store/index.js';
import { center } from '@turf/turf';

const MapSettings = () => {

    const { store } = useContext(GlobalStoreContext);

    const [mapTitle, setMapTitle] = useState('');
    const [titleOptions, setTitleOptions] = useState([]);
    const [descriptionOptions, setDescriptionOptions] = useState([]);
    const [mapDescription, setMapDescription] = useState('');

    // const [border, setBorder] = useState(store.currentMapLayer.style.border);

    const [regionLabel, setRegionLabel] = useState('');

    const [globalSettingsOpen, setGlobalSettingsOpen] = useState(true);
    const [regionSettingsOpen, setRegionSettingsOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleGlobalSettings = () => {
        setGlobalSettingsOpen(!globalSettingsOpen);
    };

    const handleRegionSettings = () => {
        setRegionSettingsOpen(!regionSettingsOpen);
    };

    const handleTitle = (event) => {
        if (event.key === "Enter") {
            let prev = _.cloneDeep(store.currentMapLayer);
            let mapLayer = store.currentMapLayer;
            mapLayer.graphicTitle = mapTitle;
            store.addUpdateLayerTransaction(prev);

            // NOTE: graphicTitle IS DIFFERENT FROM currentMap.title --> currentMap.title SHOULD BE CHANGED IN EditDetailsModal

            // console.log(mapTitle);
            // console.log(store.currentMap);
            // store.currentMap.title = mapTitle;
            // console.log(store.currentMap);
        }
    }
    const handleTitleFont = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.titleFontSize = event.target.value;
        store.addUpdateLayerTransaction(prev);
    }
    const handleTitleColor = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.titleFontColor = event.target.value;
        store.addUpdateLayerTransaction(prev);
    }
    const handleTitleOptions = (event, newOption) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.titleStyles = {};

        for (let option of newOption) {
            mapLayer.style.titleStyles[option] = true;
        }

        store.addUpdateLayerTransaction(prev);
        setTitleOptions(newOption);
    }
    
    const handleDescription = (event) => {
        if (event.key === "Enter") {
            let prev = _.cloneDeep(store.currentMapLayer);
            let mapLayer = store.currentMapLayer;
            mapLayer.graphicDescription = mapDescription;
            // NOTE: graphicDescription IS DIFFERENT FROM currentMap.description --> currentMap.description changed in EditDetailsModal
            // store.currentMap.description = mapDescription;
            store.addUpdateLayerTransaction(prev);
        }
    }
    const handleDescriptionFont = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.descriptionFontSize = event.target.value;
        store.addUpdateLayerTransaction(prev);
    }
    const handleDescriptionColor = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.descriptionFontColor = event.target.value;
        store.addUpdateLayerTransaction(prev);
    }
    const handleDescriptionOptions = (event, newOption) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.descriptionStyles = {};

        for (let option of newOption) {
            mapLayer.style.descriptionStyles[option] = true;
        }

        store.addUpdateLayerTransaction(prev);
        setDescriptionOptions(newOption);
    }

    const handleBorderToggle = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.border = !mapLayer.style.border;
        store.addUpdateLayerTransaction(prev);
        
        // setBorder(!border);
    }
    const handleBorderColor = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.borderColor = event.target.value;
        store.addUpdateLayerTransaction(prev);
    }
    const handleBorderWeight = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.borderWeight = event.target.value;
        store.addUpdateLayerTransaction(prev);
    }
    const handleBorderSolid = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.borderDashed = false;
        store.addUpdateLayerTransaction(prev);
        handleClose();
    }
    const handleBorderDashed = (event) => {
        let prev = _.cloneDeep(store.currentMapLayer);
        let mapLayer = store.currentMapLayer;
        mapLayer.style.borderDashed = true;
        store.addUpdateLayerTransaction(prev);
        handleClose();
    }


    const createNewRegion = () => {
        return {
            featureIndex: store.currentFeatureIndex,
            style: {
                fillColor: "",
                fillOpacity: 0.7,
                labelColor: ""
            },
            label: ""
        }
    }

    const handleStyleUpdate = (property, value) => {
        //console.log("STYLE UPDATE");
        //console.log(store.currentFeatureIndex);
        if (store.currentRegion && store.currentFeatureIndex >= 0) {
            let prev = _.cloneDeep(store.currentMapLayer);
            let mapLayer = store.currentMapLayer;
            
            const regionIndex = store.currentMapLayer.currentRegions.findIndex(region => region.featureIndex === store.currentFeatureIndex);
            console.log(regionIndex);
            if (regionIndex !== -1) {
                // Region found --> update values
                mapLayer.currentRegions[regionIndex].style[property] = value;
            } else {
                // Add new region to current regions
                let newRegion = createNewRegion();
                newRegion.style[property] = value;
                mapLayer.currentRegions.push(newRegion);
            }
    
            store.addUpdateLayerTransaction(prev);
        }
    }

    const handleRegionLabel = (event) => {
        if (event.key === "Enter") {
            if (store.currentRegion && store.currentFeatureIndex) {
                let prev = _.cloneDeep(store.currentMapLayer);
                let mapLayer = store.currentMapLayer;

                const regionIndex = store.currentMapLayer.currentRegions.findIndex(region => region.featureIndex === store.currentFeatureIndex);
                if (regionIndex !== -1) {
                    // Region found --> update values
                    mapLayer.currentRegions[regionIndex].label = regionLabel;
                } else {
                    // Add new region to current regions
                    let newRegion = createNewRegion();
                    newRegion.label = regionLabel;
                    mapLayer.currentRegions.push(newRegion);
                }
                
                store.addUpdateLayerTransaction(prev);
            }
        }

    }


    return (

        <div id="map-settings">

            <IconButton onClick={handleGlobalSettings} aria-label="toggle" sx={{width: '100%'}}>
                Global Settings
                {globalSettingsOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Collapse in={globalSettingsOpen} timeout="auto" unmountOnExit
                sx={{width: '95%', p: 1 }}
            >
                <Typography style={{width: '100%', alignContent: 'center', color: '#2e2e2e'}} variant='body2'><i>Press "Enter" to apply title or description text changes</i></Typography>
                <TextField
                    label="Map Title"
                    defaultValue={store.currentMapLayer ? store.currentMapLayer.graphicTitle : ''}
                    //value={mapTitle}
                    onChange={e => setMapTitle(e.target.value)}
                    onKeyDown={handleTitle}
                    fullWidth
                    margin="normal"
                />

                <Box style={{display: 'flex'}}>
                    {/* Font Size Selector for Map Title */}
                    <TextField
                        label="Font Size"
                        type="number"
                        fullWidth
                        value = {(store.currentMapLayer && store.currentMapLayer.style) ? store.currentMapLayer.style.titleFontSize : 10}
                        margin="normal"
                        inputProps={{
                            min: 10
                        }}
                        onChange={handleTitleFont}
                    />

                    {/* Font Color Picker for Map Title */}
                    <TextField
                        label="Font Color"
                        type="color"
                        fullWidth
                        value={(store.currentMapLayer && store.currentMapLayer.style) ? store.currentMapLayer.style.titleFontColor : '#000000'}
                        margin="normal"
                        onChange={handleTitleColor}
                    />
                </Box>

                <ToggleButtonGroup
                    value={titleOptions}
                    onChange={handleTitleOptions}
                    aria-label="text formatting"
                >
                    <ToggleButton value="bold" aria-label="bold">
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton value="italic" aria-label="italic">
                        <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton value="underlined" aria-label="underlined">
                        <FormatUnderlinedIcon />
                    </ToggleButton>

                </ToggleButtonGroup>

                <Divider style={{borderBottom: '2px solid black', margin: 10}} />

                <TextField
                    label="Map Description"
                    defaultValue={store.currentMapLayer ? store.currentMapLayer.graphicDescription : ''}
                    onChange={e => setMapDescription(e.target.value)}
                    onKeyDown={handleDescription}
                    fullWidth
                    margin="normal"
                />

                <Box style={{display: 'flex'}}>
                    {/* Font Size Selector for Map Description */}
                    <TextField
                        label="Font Size"
                        type="number"
                        value = {(store.currentMapLayer && store.currentMapLayer.style) ? store.currentMapLayer.style.descriptionFontSize : 10}
                        fullWidth
                        margin="normal"
                        inputProps={{
                            min: 10
                        }}
                        onChange={handleDescriptionFont}
                    />

                    {/* Font Color Picker for Map Description */}
                    <TextField
                        label="Font Color"
                        type="color"
                        value={(store.currentMapLayer && store.currentMapLayer.style) ? store.currentMapLayer.style.descriptionFontColor : '#000000'}
                        fullWidth
                        margin="normal"
                        onChange={handleDescriptionColor}
                    />
                </Box>

                <ToggleButtonGroup
                    value={descriptionOptions}
                    onChange={handleDescriptionOptions}
                    aria-label="text formatting"
                >
                    <ToggleButton value="bold" aria-label="bold">
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton value="italic" aria-label="italic">
                        <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton value="underlined" aria-label="underlined">
                        <FormatUnderlinedIcon />
                    </ToggleButton>

                </ToggleButtonGroup>

                <Divider style={{borderBottom: '2px solid black', margin: 10}}/>

                {/* Background Color Picker for Map Title */}
                {/* <TextField
                        label="Map Background Color"
                        type="color"
                        fullWidth
                        margin="normal"
                /> */}


                <Box style={{display: 'flex', alignItems: 'center'}}>
                    <FormGroup>
                        <FormControlLabel 
                            control={<Switch 
                                checked={(store.currentMapLayer && store.currentMapLayer.style.border) ? store.currentMapLayer.style.border : false}
                                onChange={handleBorderToggle}
                            />} 
                            label="Borders" 
                        />
                    </FormGroup>

                    <TextField
                        label="Border Color"
                        type="color"
                        value={(store.currentMapLayer && store.currentMapLayer.style) ? store.currentMapLayer.style.borderColor : '#000000'}
                        fullWidth
                        margin="normal"
                        onChange={handleBorderColor}
                    />

                    <TextField
                        label="Border Weight"
                        type="number"
                        value={(store.currentMapLayer && store.currentMapLayer.style) ? store.currentMapLayer.style.borderWeight : 0}
                        fullWidth
                        margin="normal"
                        inputProps={{
                            min: 0,
                            max: 10
                        }}
                        onChange={handleBorderWeight}
                    />

                    <Button
                            id="border-style-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            Border Type
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleBorderSolid}>Solid</MenuItem>
                            <MenuItem onClick={handleBorderDashed}>Dashed</MenuItem>
                        </Menu>

                </Box>

            </Collapse>

            <IconButton onClick={handleRegionSettings} aria-label="toggle" sx={{width: '100%'}}>
                Region Settings
                (Click region to edit it)
                {regionSettingsOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Collapse in={regionSettingsOpen} timeout="auto" unmountOnExit
                sx={{width: '100%', p: 1, textAlign: 'center' }}
            >
                <Typography variant='h5'>{store.currentRegion ? store.currentRegion.feature.properties.name : "Please Select a Region"}</Typography>

                {/* The components below should render only when the user clicks on a valid map region?? */}
                {store.currentRegion && (

                    <Box>      
                        <Box style={{display: 'flex', alignItems: 'center'}}>
                            <TextField
                                label="Region Label"
                                value={regionLabel}
                                onChange={e => setRegionLabel(e.target.value)}
                                onKeyDown={handleRegionLabel}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Label Color"
                                type="color"
                                fullWidth
                                margin="normal"
                                onChange={(e) => handleStyleUpdate('labelColor', e.target.value)}
                            />
                        </Box>

                        {store.mapTemplate !== 'choroplethMap' && (

                        <Box style={{display: 'flex', alignItems: 'center'}}>
                            <TextField
                                label="Fill Color"
                                type="color"
                                fullWidth
                                margin="normal"
                                onChange={(e) => handleStyleUpdate('fillColor', e.target.value)}
                            />
                            <TextField
                                label="Fill Opacity"
                                type='Number'
                                fullWidth
                                margin='normal'
                                InputProps={{
                                    inputProps: {
                                    min: 0, // Set the minimum value
                                    max: 1, // Set the maximum value
                                    step: 0.1
                                    },
                                }}
                                onChange={(e) => handleStyleUpdate('fillOpacity', e.target.value)}
                            />
                        </Box>
                        )}

                    </Box>

                )}

            </Collapse>

        </div>

    );

}

export default MapSettings;