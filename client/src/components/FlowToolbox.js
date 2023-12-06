
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
    const [lineSize, setLineSize] = useState(1);
    const [color, setColor] = useState("");
    const [valueField, setValueField] = useState("");

    const currentMap = store.currentMap.jsonData; 
    const properties = currentMap.features.map(x => x.properties);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleDataSettings = () => {
        setDataSettingsOpen(!dataSettingsOpen);
    };

    const deleteArrow = (index) => {
        //when clicked to remove
        let mapLayer = store.currentMapLayer
        mapLayer.dataValues.splice(index,1); //removes arrow for dataValues array, it will no longer be spawned, and will disappear when saved and exited
        store.updateCurrentMapLayer(mapLayer);
    }
    const handleArrowData = (event,index,defaultVal) => {
        if (event.key === "Enter") {
            let mapLayer = store.currentMapLayer;
            let oldData = mapLayer.dataValues;
            if(index>=0){
                oldData.splice(index,1);//removes arrows so it can be replaced
            }
            console.log(defaultVal);
            let slat = parseFloat(arrowDataslat);
            let slng = parseFloat(arrowDataslng);
            let elat = parseFloat(arrowDataelat);
            let elng = parseFloat(arrowDataelng);
            let size = lineSize;
            let colour = color;
            if(isNaN(parseFloat(arrowDataslat))){
                slat = defaultVal[0];
            }
            if(isNaN(parseFloat(arrowDataslng))){
                slng = defaultVal[1];
            }
            if(isNaN(parseFloat(arrowDataelat))){
                elat = defaultVal[2];
            }
            if(isNaN(parseFloat(arrowDataelng))){
                elng = defaultVal[3]
            }
            if(isNaN(lineSize)||lineSize<=0){
                size = defaultVal[4];
            }
            if(color===""){
                colour = defaultVal[5];
            }
            console.log("VALUE:\n" + arrowDataslat +", "+arrowDataslng +"\n"+arrowDataelat +", "+arrowDataelng);
            //mapLayer.dataValues = [parseFloat(arrowDataslat),parseFloat(arrowDataslng),parseFloat(arrowDataelat),parseFloat(arrowDataelng)];
            mapLayer.dataValues = [{
                originLatitude: slat,
                originLongitude: slng,
                destinationLatitude: elat,
                destinationLongitude: elng,
                value: 0,//index
                lineSizeScale: size,
                colorScale: colour
            }]
            for(let coordinate of oldData){
                console.log(coordinate);
                mapLayer.dataValues.push(coordinate);
            }
            console.log(mapLayer);
            store.updateCurrentMapLayer(mapLayer);
            console.log(store.currentMapLayer);
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
    const setArrowColor = (color, defaultVal) => {
        console.log(color);
        setColor(color);
    }
    const otherArrows = store.currentMapLayer.dataValues;
    const inputCoordinates = [];
    var coordinateIndex = 0;
    for(let coordinate of otherArrows){
        coordinate.value=coordinateIndex;
        inputCoordinates.push(
        <div>
            <div style={{display: 'flex'}}>
                <div style={{width: '50%', paddingTop: '5%'}}>{'startLat\nstartLng'}</div>
                <div>
                    <TextField
                        // label={property.value}
                        defaultValue={coordinate.originLatitude}
                        // onChange = {(e) => (property.value =  e.target.value)}
                        onChange={(e) => setArrowDataslat(e.target.value)}
                        onKeyDown={(e) => handleArrowData(e,coordinate.value, [coordinate.originLatitude,coordinate.originLongitude,coordinate.destinationLatitude,coordinate.destinationLongitude,coordinate.lineSizeScale,coordinate.colorScale])}
                    />
                    <TextField
                        // label={property.value}
                        defaultValue={coordinate.originLongitude}
                        // onChange = {(e) => (property.value =  e.target.value)}
                        onChange={(e) => setArrowDataslng(e.target.value)}
                        onKeyDown={(e) => handleArrowData(e,coordinate.value, [coordinate.originLatitude,coordinate.originLongitude,coordinate.destinationLatitude,coordinate.destinationLongitude,coordinate.lineSizeScale,coordinate.colorScale])}
                    />
                </div>
                <div style={{width: '50%', paddingTop: '5%'}}>{'endLat\nendLng'}</div>
                <div>
                    <TextField
                        // label={property.value}
                        defaultValue={coordinate.destinationLatitude}
                        // onChange = {(e) => (property.value =  e.target.value)}
                        onChange={(e) => setArrowDataelat(e.target.value)}
                        onKeyDown={(e) => handleArrowData(e,coordinate.value, [coordinate.originLatitude,coordinate.originLongitude,coordinate.destinationLatitude,coordinate.destinationLongitude,coordinate.lineSizeScale,coordinate.colorScale])}
                    />
                    <TextField
                        // label={property.value}
                        defaultValue={coordinate.destinationLongitude}
                        // onChange = {(e) => (property.value =  e.target.value)}
                        onChange={(e) => setArrowDataelng(e.target.value)}
                        onKeyDown={(e) => handleArrowData(e,coordinate.value, [coordinate.originLatitude,coordinate.originLongitude,coordinate.destinationLatitude,coordinate.destinationLongitude,coordinate.lineSizeScale,coordinate.colorScale])}
                    />
                </div>
                <IconButton variant="outlined" onClick={() => deleteArrow(coordinate.value)}>
                    <DeleteIcon/>
                </IconButton>
                <br></br>
            </div>
            <div>
                <div style={{width: '50%', paddingTop: '5%'}}>{'Line Size'}</div>
                <div>
                    <TextField
                        // label={property.value}
                        defaultValue={coordinate.lineSizeScale}
                        // onChange = {(e) => (property.value =  e.target.value)}
                        onChange={(e) => setLineSize(e.target.value)}
                        onKeyDown={(e) => handleArrowData(e,coordinate.value, [coordinate.originLatitude,coordinate.originLongitude,coordinate.destinationLatitude,coordinate.destinationLongitude,coordinate.lineSizeScale,coordinate.colorScale])}
                    />
                </div>
                <div>
                    <TextField
                        label="Color"
                        type="color"
                        value={color}
                        fullWidth
                        onChange={(e) => setArrowColor(e.target.value, [coordinate.originLatitude,coordinate.originLongitude,coordinate.destinationLatitude,coordinate.destinationLongitude,coordinate.lineSizeScale,coordinate.colorScale])}
                    />
                </div>
            </div>    
        </div>)
        coordinateIndex++;
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
                        <Typography style={{fontSize: '16px'}}>Type the latitude and longitudes to create arrow</Typography>
                        <Typography style={{fontSize: '16px'}}>Press Enter after entering in all text boxes; </Typography>
                        <Typography style={{fontSize: '16px'}}>Pressing Enter early may cause errors;</Typography>
                        <Typography style={{fontSize: '16px'}}>To see updated changes, save and exit then reenter</Typography>
                        {
                            <div>
                                <div>
                                    <div style={{display: 'flex'}}>
                                        <div style={{width: '50%', paddingTop: '5%'}}>{'startLat\nstartLng'}</div>
                                        <div>
                                            <TextField
                                                // label={property.value}
                                                defaultValue={null}
                                                // onChange = {(e) => (property.value =  e.target.value)}
                                                onChange={(e) => setArrowDataslat(e.target.value)}
                                                onKeyDown={(e) => handleArrowData(e,-1,[0,0,0,0,1,'red'])}
                                            />
                                            <TextField
                                                // label={property.value}
                                                defaultValue={null}
                                                // onChange = {(e) => (property.value =  e.target.value)}
                                                onChange={(e) => setArrowDataslng(e.target.value)}
                                                onKeyDown={(e) => handleArrowData(e,-1,[0,0,0,0,1,'red'])}
                                            />
                                        </div>
                                        <div style={{width: '50%', paddingTop: '5%'}}>{'endLat\nendLng'}</div>
                                        <div>
                                            <TextField
                                                // label={property.value}
                                                defaultValue={null}
                                                // onChange = {(e) => (property.value =  e.target.value)}
                                                onChange={(e) => setArrowDataelat(e.target.value)}
                                                onKeyDown={(e) => handleArrowData(e,-1,[0,0,0,0,1,'red'])}
                                            />
                                            <TextField
                                                // label={property.value}
                                                defaultValue={null}
                                                // onChange = {(e) => (property.value =  e.target.value)}
                                                onChange={(e) => setArrowDataelng(e.target.value)}
                                                onKeyDown={(e) => handleArrowData(e,-1,[0,0,0,0,1,'red'])}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{width: '50%', paddingTop: '5%'}}>{'Line Size'}</div>
                                        <div>
                                            <TextField
                                                // label={property.value}
                                                defaultValue={null}
                                                // onChange = {(e) => (property.value =  e.target.value)}
                                                onChange={(e) => setLineSize(e.target.value)}
                                                onKeyDown={(e) => handleArrowData(e,-1,[0,0,0,0,1,'red'])}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                label="Color"
                                                type="color"
                                                value={color}
                                                fullWidth
                                                onChange={(e) => setArrowColor(e.target.value,[0,0,0,0,1,'red'])}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {inputCoordinates}
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
