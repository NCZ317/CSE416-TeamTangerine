
import React, { useState, useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, ToggleButton, IconButton, Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MapSettings from './MapSettings';
import L from 'leaflet';
import _ from 'lodash'; 


import { GlobalStoreContext } from '../store';

const FlowToolbox = () => {
    const { store } = useContext(GlobalStoreContext);

    const [selectedTab, setSelectedTab] = useState(0);
    const [flowSettingsOpen, setFlowSettingsOpen] = useState(false);
    const [legendSettingsOpen, setLegendSettingsOpen] = useState(false);

    const [valueField, setValueField] = useState("");
    const [legend, setLegend] = useState(store.currentMapLayer.colorScale);

    const [label, setLabel] = useState("");
    const [flow, setFlow] = useState([]);

    useEffect(() => {
        console.log("FLOWMAP LISTENER");
        if (store.currentFlow) {
            setFlow(store.currentFlow)
            setLabel(store.currentFlow.label);
        }
    }, [store.currentFlow]);


    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleFlowSettings = () => {
        setFlowSettingsOpen(!flowSettingsOpen);
    };
    const handleLegendSettings = () => {
        setLegendSettingsOpen(!legendSettingsOpen);
    }

    const handleCoordinate = (type, isOrigin, event) => {
        let mapLayer = store.currentMapLayer;
        let currentPoint = isOrigin ? mapLayer.dataValues[store.currentFlowIndex].origin : mapLayer.dataValues[store.currentFlowIndex].destination;
    
        let updatedPoint;
        if (type === 'lat') {
            updatedPoint = L.latLng(event.target.value, currentPoint.lng);
        } else if (type === 'lng') {
            updatedPoint = L.latLng(currentPoint.lat, event.target.value);
        }
    
        if (isOrigin) {
            mapLayer.dataValues[store.currentFlowIndex].origin = updatedPoint;
        } else {
            mapLayer.dataValues[store.currentFlowIndex].destination = updatedPoint;
        }
    
        store.updateCurrentMapLayer(mapLayer);
    };

    const handleLineColor = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.dataValues[store.currentFlowIndex].color = event.target.value;
        store.updateCurrentMapLayer(mapLayer);

    }

    const handleLineSize = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.dataValues[store.currentFlowIndex].lineSize = event.target.value;
        store.updateCurrentMapLayer(mapLayer);
    }

    const handleLineLabel = (event) => {
        if (event.key === "Enter") {

            let mapLayer = store.currentMapLayer;
            mapLayer.dataValues[store.currentFlowIndex].label = label;
            store.updateCurrentMapLayer(mapLayer);
        }
    }

    const handleDeleteLine = (event) => {
        let mapLayer = store.currentMapLayer;
        mapLayer.dataValues.splice(store.currentFlowIndex, 1);
        store.updateCurrentMapLayer(mapLayer);
        store.setCurrentFlow(null, null);
    }

// ---------------------------------------------------------------------------

    const handleValueField = (event) => {
        if (event.key === "Enter") {
            let mapLayer = store.currentMapLayer;
            mapLayer.valueField = valueField;
            store.updateCurrentMapLayer(mapLayer);
        }
    }

    const addLegendRow = () => {
        setLegend([...legend, { value: '', color: 'black' }]);
    };
    const deleteLegendRow = (index) => {
        const newLegend = [...legend];
        newLegend.splice(index, 1);
;
        let mapLayer = store.currentMapLayer;
        mapLayer.colorScale = newLegend;
        store.updateCurrentMapLayer(mapLayer);
        setLegend(newLegend);
    };

    const handleLegendValue = (index, value) => {
        const newLegend = [...legend];
        newLegend[index].value = value;
        setLegend(newLegend);
    };
    const updateLegendValue = (event, index) => {
        if (event.key === "Enter") {

            if (event.target.value === "") {
                const newLegend = [...legend];
                newLegend[index].value = "";
                newLegend[index].color = 'black';     //CHANGE IT TO DEFAULT VALUE WHEN USER CLEARS LEGEND VALUE
                
                let mapLayer = store.currentMapLayer;
                mapLayer.colorScale = newLegend;
                store.updateCurrentMapLayer(mapLayer);
                setLegend(newLegend);

            } else {
                let mapLayer = store.currentMapLayer;
                mapLayer.colorScale = legend;
                store.updateCurrentMapLayer(mapLayer);

            }

        }
    }
    const handleLegendColor = (index, color) => {
        const newLegend = [...legend];
        newLegend[index].color = color;

        let mapLayer = store.currentMapLayer;
        mapLayer.colorScale = newLegend;
        store.updateCurrentMapLayer(mapLayer);
        setLegend(newLegend);
    };


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

                    <Typography variant='h6' style={{marginTop: 20, textAlign: 'center'}}>Click the Edit Icon to Add Flow</Typography>
                    <Box style={{display: 'flex', justifyContent: 'space-evenly', marginTop: 20}}> 

                        <ToggleButton
                                style={{
                                    backgroundColor: store.flowmapEditActive ? '#4caf50' : '#ccc',
                                    color: store.flowmapEditActive ? '#fff' : '#333',
                                }}
                                selected={store.flowmapEditActive}
                                onChange={() => {
                                    store.setFlowmapEditActive(!store.flowmapEditActive);
                                }}
                            >
                            <ModeEditIcon />
                        </ToggleButton>

                    </Box>

                    <Divider style={{borderBottom: '2px solid black', margin: 10}} />

                    <IconButton onClick={handleFlowSettings} aria-label="toggle" sx={{width: '100%'}}>
                        Flow Properties 
                        {flowSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={flowSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >

                        <Typography variant='h6' style={{margin: 20, textAlign: 'center'}} >
                            {store.currentFlow ? store.currentFlow.label : "Click on a flow to change its properties"}
                        </Typography>
                


                        {store.currentFlow && (
                            <div>

                                <div style={{display: 'flex', marginBottom: '12px'}}>

                                    <Typography style={{ marginRight: '8px', alignSelf: 'center', fontWeight: 'bold', width: '50%'}}>Origin:</Typography>
                                    <TextField
                                        label="Latitude"
                                        value={flow && flow.origin ? flow.origin.lat : ""}
                                        fullWidth
                                        type='number'
                                        InputProps={{
                                            inputProps: {
                                                step: 1
                                            },
                                        }}
                                        onChange={(e) => handleCoordinate('lat', true, e)}
                                    />
                                    <TextField
                                        label="Longitude"
                                        value={flow && flow.origin ? flow.origin.lng : ""}
                                        fullWidth
                                        type='number'
                                        InputProps={{
                                            inputProps: {
                                                step: 1
                                            },
                                        }}
                                        onChange={(e) => handleCoordinate('lng', true, e)}
                                    />
                                </div>

                                <div style={{display: 'flex', marginBottom: '20px'}}>
                                    <Typography style={{ marginRight: '8px', alignSelf: 'center', fontWeight: 'bold', width: '50%'}}>Destination:</Typography>
                                    <TextField
                                        label="Latitude"
                                        value={flow && flow.destination ? flow.destination.lat : ""}
                                        fullWidth
                                        type='number'
                                        InputProps={{
                                            inputProps: {
                                                step: 1
                                            },
                                        }}
                                        onChange={(e) => handleCoordinate('lat', false, e)}
                                    />
                                    <TextField
                                        label="Longitude"
                                        value={flow && flow.destination ? flow.destination.lng : ""}
                                        fullWidth
                                        type='number'
                                        InputProps={{
                                            inputProps: {
                                                step: 1
                                            },
                                        }}
                                        onChange={(e) => handleCoordinate('lng', false, e)}
                                    />
                                </div>

                                <div style={{display: 'flex', marginBottom: 20}}>
                                    <TextField
                                        // key={flow}
                                        label="Color"
                                        type="color"
                                        // defaultValue={store.currentFlow ? store.currentFlow.color : 'green'}
                                        value={flow && flow.color ? flow.color : 'black'}
                                        onChange={handleLineColor}
                                        fullWidth
                                    />
                                </div>
                                <div style={{display: 'flex', marginBottom: 20}}>
                                    <TextField
                                        label="Line Size"
                                        type="number"
                                        value={flow && flow.lineSize ? flow.lineSize : 1}
                                        inputProps={{
                                            min: 1
                                        }}
                                        onChange={handleLineSize}
                                        fullWidth
                                    />
                                </div>
                                <div style={{display: 'flex', marginBottom: 20}}>
                                    <TextField
                                        label="Flow Label"
                                        // value={flow && flow.label ? flow.label : ""}
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                        onKeyDown={handleLineLabel}
                                        fullWidth
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 20 }}>
                                    <IconButton style={{border: '1px solid darkgreen'}} onClick={handleDeleteLine}>
                                        <DeleteIcon style={{fontSize: 48, color: 'darkgreen'}} />
                                    </IconButton>
                                </div>

                            </div>
                        )}

                    </Collapse>

                    <IconButton onClick={handleLegendSettings} aria-label="toggle" sx={{width: '100%'}}>
                        Legend
                        {legendSettingsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Collapse in={legendSettingsOpen} timeout="auto" unmountOnExit
                        sx={{width: '100%', p: 1, textAlign: 'center' }}
                    >
                        
                        <Box style={{p: 5}}>
                            <TextField
                                label="Data Description"
                                onChange={(e) => setValueField(e.target.value)}
                                onKeyDown={handleValueField}
                                defaultValue={store.currentMapLayer.valueField}
                                fullWidth
                            />
                        </Box>
                        
                        <br></br>
                        {legend.map((row, index) => (
                            <div key={index} style={{display: 'flex', marginBottom: 10}}>
                                <TextField
                                    label="Category"
                                    value={row.value}
                                    fullWidth
                                    onChange={(e) => handleLegendValue(index, e.target.value)}
                                    onKeyDown={(e) => updateLegendValue(e, index)}
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

export default FlowToolbox;

