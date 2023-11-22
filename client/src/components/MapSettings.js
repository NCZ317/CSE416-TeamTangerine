
import React, { useState } from 'react';
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

const MapSettings = () => {

    const [mapTitle, setMapTitle] = useState('');
    const [mapDescription, setMapDescription] = useState('');
    const [titleStyle, setTitleStyle] = useState({ fontFamily: 'Arial', fontSize: '16px', color: '#000', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' });
    const [titleFormats, setTitleFormats] = React.useState(() => ['bold', 'italic', 'underline']);
    const [descriptionStyle, setDescriptionStyle] = useState({ fontFamily: 'Arial', fontSize: '14px', color: '#888', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' });
    const [descriptionFormat, setDescriptionFormat] = React.useState(() => ['bold', 'italic', 'underline']);

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
                    />

                    {/* Font Color Picker for Map Title */}
                    <TextField
                        label="Font Color"
                        type="color"
                        fullWidth
                        margin="normal"
                    />
                </Box>

                <ToggleButtonGroup
                    // value={formats}
                    // onChange={handleFormat}
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
                    />

                    {/* Font Color Picker for Map Description */}
                    <TextField
                        label="Font Color"
                        type="color"
                        fullWidth
                        margin="normal"
                    />
                </Box>

                <ToggleButtonGroup
                    // value={formats}
                    // onChange={handleFormat}
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
                        <FormControlLabel control={<Switch defaultChecked />} label="Borders" />
                    </FormGroup>

                    <TextField
                        label="Border Color"
                        type="color"
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Border Radius"
                        type="number"
                        fullWidth
                        margin="normal"
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
                            <MenuItem onClick={handleClose}>Solid</MenuItem>
                            <MenuItem onClick={handleClose}>Dashed</MenuItem>
                            <MenuItem onClick={handleClose}>Dotted</MenuItem>
                        </Menu>

                </Box>

            </Collapse>

            <IconButton onClick={handleRegionSettings} aria-label="toggle" sx={{width: '100%'}}>
                Region Settings
                {regionSettingsOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Collapse in={regionSettingsOpen} timeout="auto" unmountOnExit
                sx={{width: '100%', p: 1, textAlign: 'center' }}
            >
                <Typography>Click on a map region to set its style</Typography>

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

                <TextField
                    label="Fill Color"
                    type="color"
                    fullWidth
                    margin="normal"
                />

            </Collapse>

        </div>

    );

}

export default MapSettings;