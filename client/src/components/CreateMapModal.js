import * as React from 'react';
import { useState, useRef } from 'react';
import { useContext } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';
import {
    Button,
    Modal,
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function CreateMapModal({open,onClose}) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [template, setTemplate] = useState("");
    const [page, setPage] = useState("");
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log('Selected File:', file);
        setSelectedFile(file);
    };


    const handleFileUpload = () => {
        // Trigger the file input when the IconButton is clicked
        fileInputRef.current.click();
    };

    const handleCreateMap = async () => {
        // Check if a file is selected
        if (!selectedFile) {
            console.log("No file selected");
            return;
        }

        // Read the contents of the selected GeoJSON file
        const reader = new FileReader();
        reader.onload = async (event) => {
            const jsonData = JSON.parse(event.target.result);

            // Call the store.createNewMap function with the GeoJSON data
            console.log(jsonData);
            await store.createNewMap(jsonData, template);
            
            // Close the modal and set the screen to "MAP_EDITOR"
            onClose();
            store.setScreen("MAP_EDITOR");
        };

        reader.readAsText(selectedFile);
    };

    const selectedCard = {
        border: '2px solid black'
    }

    return (
        <Modal open={open} onClose={onClose} id='create-map-modal'>
            <Paper id = "create-map-paper">
                <Typography variant="h3" gutterBottom className="modal-title">
                    Select Template
                </Typography>
                <Box id="create-map-box">
                    {/* Choropleth Template */}
                    <Box
                        className = "create-map-card"
                        style={{
                            ...(template === 'choroplethMap' ? selectedCard : {}),
                        }}
                        onClick={() => setTemplate('choroplethMap')}
                    >
                        <Card className="map-template-card">
                            <CardContent className="map-template-content">
                                <Typography variant="h6" component="div">
                                Choropleth Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Heat Template */}
                    <Box
                        className = "create-map-card"
                        style={{
                            ...(template === 'heatMap' ? selectedCard : {}),
                        }}
                        onClick={() => setTemplate('heatMap')}
                    >
                        <Card className="map-template-card">
                            <CardContent className="map-template-content">
                                <Typography variant="h6" component="div">
                                Heat Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Dot Density Template */}
                    <Box
                        className = "create-map-card"
                        style={{
                            ...(template === 'dotDensityMap' ? selectedCard : {}),
                        }}
                        onClick={() => setTemplate('dotDensityMap')}
                    >
                        <Card className="map-template-card">
                            <CardContent className="map-template-content">
                                <Typography variant="h6" component="div">
                                Dot Density Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Graduated Symbol Map */}
                    <Box
                        className = "create-map-card"
                        style={{
                            ...(template === 'graduatedSymbolMap' ? selectedCard : {}),
                        }}
                        onClick={() => setTemplate('graduatedSymbolMap')}
                    >
                        <Card className="map-template-card">
                            <CardContent className="map-template-content">
                                <Typography variant="h6" component="div">
                                Graduated Symbol Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Flow Map */}
                    <Box
                        className = "create-map-card"
                        style={{
                            ...(template === 'flowMap' ? selectedCard : {}),
                        }}
                        onClick={() => setTemplate('flowMap')}
                    >
                        <Card className="map-template-card">
                            <CardContent className="map-template-content">
                                <Typography variant="h6" component="div">
                                Flow Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                </Box>

                <Typography variant="h3" gutterBottom id="create-map-typography">
                    Upload File
                </Typography>

                 {/* Upload Button */}
                <Box className="modal-title">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".geojson, .shp, .kml .zip, .json"
                        id="create-map-input"
                        onChange={handleFileChange}
                    />
                    <IconButton
                        variant="contained"
                        className="create-map-button-upload"
                        disabled={template === ''}
                        onClick={handleFileUpload}
                    >
                        <CloudUploadIcon className='create-map-cloud-icon' />
                    </IconButton>
                    {selectedFile && (
                        <Box mt={1}>
                            <Typography variant="body2" color="textSecondary">
                                Selected File: {selectedFile.name}
                            </Typography>
                        </Box>
                    )}
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Supported File Types:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        geoJSON, Shapefile, KML
                    </Typography>
                </Box>
                
                <Box mt={2} id="create-map-box-create">
                    <Button
                        variant="contained"
                        color="primary"
                        className="login-button"
                        onClick={handleCreateMap}
                        disabled={selectedFile === null}
                    >
                        Create
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}

