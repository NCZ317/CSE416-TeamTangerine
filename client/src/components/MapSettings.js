
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

import { GlobalStoreContext } from '../store/index.js';

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
            let mapLayer = store.currentMapLayer;
            mapLayer.graphicTitle = mapTitle;
            store.updateCurrentMapLayer(mapLayer);

            // NOTE: graphicTitle IS DIFFERENT FROM currentMap.title --> currentMap.title SHOULD BE CHANGED IN EditDetailsModal

            // console.log(mapTitle);
            // console.log(store.currentMap);
            // store.currentMap.title = mapTitle;
            // console.log(store.currentMap);
        }
    }
    const handleTitleFont = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.titleFontSize = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }
    const handleTitleColor = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.titleFontColor = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }
    const handleTitleOptions = (event, newOption) => {

        let mapLayer = store.currentMapLayer;
        mapLayer.style.titleStyles = {};

        for (let option of newOption) {
            mapLayer.style.titleStyles[option] = true;
        }

        store.updateCurrentMapLayer(mapLayer);
        setTitleOptions(newOption);
    }
    
    const handleDescription = (event) => {
        if (event.key === "Enter") {
            let mapLayer = store.currentMapLayer;
            mapLayer.graphicDescription = mapDescription;
            // NOTE: graphicDescription IS DIFFERENT FROM currentMap.description --> currentMap.description changed in EditDetailsModal
            // store.currentMap.description = mapDescription;
            store.updateCurrentMapLayer(mapLayer);
        }
    }
    const handleDescriptionFont = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.descriptionFontSize = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }
    const handleDescriptionColor = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.descriptionFontColor = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }
    const handleDescriptionOptions = (event, newOption) => {

        let mapLayer = store.currentMapLayer;
        mapLayer.style.descriptionStyles = {};

        for (let option of newOption) {
            mapLayer.style.descriptionStyles[option] = true;
        }

        store.updateCurrentMapLayer(mapLayer);
        setDescriptionOptions(newOption);
    }

    const handleBorderToggle = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.border = !mapLayer.style.border;
        store.updateCurrentMapLayer(mapLayer);
        // setBorder(!border);
    }
    const handleBorderColor = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.borderColor = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }
    const handleBorderWeight = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.borderWeight = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }
    const handleBorderSolid = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.borderDashed = false;
        store.updateCurrentMapLayer(mapLayer);
        handleClose();
    }
    const handleBorderDashed = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.style.borderDashed = true;
        store.updateCurrentMapLayer(mapLayer);
        handleClose();
    }


    const handleFillColor = (event) => {
        if (store.currentRegion) {
            store.currentRegion.setStyle({
                fillColor: event.target.value
            });
            var inRegions = false;
            for(let region of store.currentMap.currentRegions){
                if(region.feature.properties.name===store.currentRegion.feature.properties.name){
                    inRegions = true;
                    region.options.fillColor=event.target.value
                    break;
                }
            }
            console.log(store.currentRegion);
            if(!inRegions){
                let newRegion = {
                    feature: store.currentMap.feature,      //store.currentRegion.feature?????
                    options: {
                        fillColor : event.target.value,
                        fillOpacity : store.currentRegion.options.fillOpacity
                    }
                }
                store.currentMap.currentRegions.push(newRegion); 
            }
            var allRegions = store.currentMap.currentRegions;
            console.log(allRegions);
            console.log(store.currentMap);
        }
    }

    const handleFillOpacity = (event) => {
        if (store.currentRegion) {
            console.log(store.currentRegion);
            store.currentRegion.setStyle({
                fillOpacity: event.target.value
            });
        }
    }


    return (

        <div id="map-settings">

            <IconButton onClick={handleGlobalSettings} aria-label="toggle" sx={{width: '100%'}}>
                Global Settings
                {globalSettingsOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Collapse in={globalSettingsOpen} timeout="auto" unmountOnExit
                sx={{width: '100%', p: 1 }}
            >
                
                <TextField
                    label="Map Title"
                    value={mapTitle}
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
                    value={mapDescription}
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
                <TextField
                        label="Map Background Color"
                        type="color"
                        fullWidth
                        margin="normal"
                />


                <Box style={{display: 'flex', alignItems: 'center'}}>
                    <FormGroup>
                        <FormControlLabel 
                            control={<Switch 
                                defaultChecked={store.currentMapLayer.style.border} 
                                onChange={handleBorderToggle}
                            />} 
                            label="Borders" 
                        />
                    </FormGroup>

                    <TextField
                        label="Border Color"
                        type="color"
                        fullWidth
                        margin="normal"
                        onChange={handleBorderColor}
                    />

                    <TextField
                        label="Border Weight"
                        type="number"
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
                <Typography>{store.currentRegion ? store.currentRegion.feature.properties.name : "Please Select a Region"}</Typography>

                {/* The components below should render only when the user clicks on a valid map region?? */}

                <Box style={{display: 'flex', alignItems: 'center'}}>
                    <TextField
                        label="Region Label"
                        value={regionLabel}
                        onChange={e => setRegionLabel(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Label Color"
                        type="color"
                        fullWidth
                        margin="normal"
                    />
                    <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked />} label="Label" />
                    </FormGroup>
                </Box>

                <Box style={{display: 'flex', alignItems: 'center'}}>
                    <TextField
                        label="Fill Color"
                        type="color"
                        fullWidth
                        margin="normal"
                        onChange={handleFillColor}
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
                        onChange={handleFillOpacity}
                    />

                </Box>
                

            </Collapse>

        </div>

    );

}

export default MapSettings;