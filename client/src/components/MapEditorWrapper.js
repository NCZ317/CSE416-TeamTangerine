import React, { useState, Component, useContext } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button, Drawer, IconButton, ButtonGroup  } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import AppBanner from './AppBanner';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as shapefile from 'shapefile';
import toGeoJSON from 'togeojson';
import JSZip from 'jszip';
import MapWrapper from './MapWrapper';
import ChoroplethToolbox from './ChoroplethToolbox';
import HeatmapToolbox from './HeatmapToolbox';
import DotDensityToolbox from './DotDensityToolbox';
import GraduatedSymbolToolbox from './GraduatedSymbolToolbox';
import FlowToolbox from './FlowToolbox';
import AuthContext from '../auth';

import { GlobalStoreContext } from '../store';

const drawerWidth = '25%';

const MapEditorWrapper = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = (event) => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
    setOpen(false);
    };

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }

    const handleSave = async () => {
        auth.viewUser(auth.user.email);
        auth.userToView = auth.user;
        await store.updateCurrentMap();
        store.setScreen("USER");
    }
    /* const Toolbox = () => {
        console.log(store.currentMap);
        switch(store.mapTemplate){
            case 'choroplethMap':
                return(<ChoroplethToolbox/>);
            case 'heatMap':
                return(<HeatmapToolbox/>);
            case 'dotDensityMap':
                return(<DotDensityToolbox/>);
            case 'graduatedSymbolMap':
                return(<GraduatedSymbolToolbox/>);
            // case 'flowMap':  //for when we get the flowMap toolbox
            //     return(<FlowMapToolbox/>);
        }
    } */
    console.log(store);
    return (
        <div style={{ height: '100%' }}>
            {/* <AppBanner /> */}            
            <MapWrapper id='editor-map' />
            <>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                sx={{ ...(open && { display: 'none' }) }}
                id='map-editor-sidebar'
                > 
                    Toolbox
                </IconButton>
                <Drawer
                    sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        top: 0,
                        // mt: '7%',
                        bottom: 0,
                        backgroundColor: '#79c200',
                        color: '#000',
                        borderTopLeftRadius: "25px",
                        borderBottomLeftRadius: "25px",
                        height: '100%',
                        overflowX: "hidden"
                    },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >   
                    <div className='map-editor-drawer-header'>
                        <ButtonGroup id='undo-redo-buttons'>
                            <Button variant='contained' id='undo-button' disabled={!store.canUndo()} onClick={handleUndo}>
                                <UndoIcon fontSize='small' />
                            </Button>
                            <Button variant='contained' id='redo-button' disabled={!store.canRedo()} onClick={handleRedo}>
                                <RedoIcon fontSize='small' />
                            </Button>
                        </ButtonGroup>
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon fontSize='large' />
                        </IconButton>
                    </div>

                    {/* RENDERING THE <Toolbox/> COMPONENT CAUSES THE TOOLBOX TABS TO CHANGE EVERY TIME THE STATE CHANGES */}
                    {/* <Toolbox/> */}
                    
                    {store.mapTemplate === "choroplethMap" && <ChoroplethToolbox/>}
                    {store.mapTemplate === "heatMap" && <HeatmapToolbox/>}
                    {store.mapTemplate === "dotDensityMap" && <DotDensityToolbox/>}
                    {store.mapTemplate === "graduatedSymbolMap" && <GraduatedSymbolToolbox/>}
                    {store.mapTemplate === "flowMap" && <FlowToolbox />}
                </Drawer>
            </>
            <>
                <Button variant="contained" color="primary" onClick={handleSave} id='map-editor-save'>
                    Save & Exit
                </Button>
            </>
        </div>
    );
};
export default MapEditorWrapper;
