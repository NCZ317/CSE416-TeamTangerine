import React, { useState, Component, useContext } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button, Drawer, IconButton } from '@mui/material';
import AppBanner from './AppBanner';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as shapefile from 'shapefile';
import toGeoJSON from 'togeojson';
import JSZip from 'jszip';
import MapWrapper from './MapWrapper';

import { GlobalStoreContext } from '../store';

const drawerWidth = 240;

const MapEditorWrapper = () => {

    const { store } = useContext(GlobalStoreContext);

    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = (event) => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
    setOpen(false);
    };

    const handleSave = () =>{
        store.setScreen("USER");
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
                        top: '15%',
                        backgroundColor: '#79c200',
                        color: '#000',
                        borderRadius: "25px",
                        height: '75%',
                    },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >   
                    <div className='map-editor-drawer-header'>
                        <IconButton onClick={handleDrawerClose}>
                            close
                        </IconButton>
                    </div>
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
