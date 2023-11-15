import React, { useState, Component } from 'react';
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

const drawerWidth = 240;

const MapEditorWrapper = () => {
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = (event) => {
        setOpen(true);
      };
    
      const handleDrawerClose = () => {
        setOpen(false);
      };
      const handleSave = () =>{
        alert("save");
      }
    const sidebar = {
        height: '20%',
        width: '5%',
        position: 'absolute',
        zIndex: '1000',
        right: '0',
        top: '25%',
        backgroundColor: '#79c200',
        color: '#000',
        borderRadius: "25px",
        textOrientation: "sideways",
        writingMode: "vertical-lr",
    }
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }));
      const saveButton = {
        backgroundColor: '#79c200',
        color: '#000',
        borderRadius: "25px",
        position: 'absolute',
        zIndex: '1000',
        bottom: '5%',
        left: '3%'
      }

    return (
        <div style={{ height: '100%' }}>
            {/* <AppBanner /> */}            
            <MapWrapper/>
            <>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                sx={{ ...(open && { display: 'none' }) }}
                style = {sidebar}
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
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            close
                        </IconButton>
                    </DrawerHeader>
                </Drawer>
            </>
            <>
                <Button variant="contained" color="primary" onClick={handleSave} style={saveButton}>
                    Save & Exit
                </Button>
            </>
        </div>
    );
};
export default MapEditorWrapper;
