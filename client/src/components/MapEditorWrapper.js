import React, { useState, Component, useContext } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button, Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

import { GlobalStoreContext } from '../store';

const drawerWidth = '25%';

const MapEditorWrapper = () => {

    const { store } = useContext(GlobalStoreContext);
    console.log(store);
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = (event) => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
    setOpen(false);
    };

    const handleSave = () => {
        
        // await store.updateCurrentMap();
        store.setScreen("USER");
    }
    const Toolbox = () => {
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
    }
    return (
        <div style={{ height: '100%' }}>
            {/* <AppBanner /> */}            
            <MapWrapper id='editor-map'/>
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
                        bottom: 0,
                        backgroundColor: '#79c200',
                        color: '#000',
                        // borderRadius: "25px",
                        // height: '75%',
                    },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >   
                    <div className='map-editor-drawer-header'>
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon fontSize='large'/>
                        </IconButton>
                    </div>

                    {/* RENDERING THE <Toolbox/> COMPONENT CAUSES THE TOOLBOX TABS TO CHANGE EVERY TIME THE STATE CHANGES */}
                    {/* <Toolbox/> */}
                    
                    {store.mapTemplate === "choroplethMap" && <ChoroplethToolbox/>}
                    {store.mapTemplate === "heatMap" && <HeatmapToolbox/>}
                    {store.mapTemplate === "dotDensityMap" && <DotDensityToolbox/>}
                    {store.mapTemplate === "graduatedSymbolMap" && <GraduatedSymbolToolbox/>}
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
