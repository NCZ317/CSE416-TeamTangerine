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


    const handleFileUpload = () => {
        // Trigger the file input when the IconButton is clicked
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Selected File:', selectedFile);
    };

    const handleCreateMap = () => {
        console.log("Make Map");
        onClose();
        store.setScreen("MAP_EDITOR");
    }

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
                    <Box>
                        <Card className = "create-map-card"
                        style={{
                            ...(template === 'choroplethMap' ? {selectedCard} : {}),
                        }}
                        onClick={() => setTemplate('choroplethMap')}
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                Choropleth Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Heat Template */}
                    <Box>
                        <Card className = "create-map-card"
                        style={{
                            ...(template === 'heatMap' ? selectedCard : {}),
                          }}
                        onClick={() => setTemplate('heatMap')}
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                Heat Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Dot Density Template */}
                    <Box>
                        <Card className = "create-map-card"
                        style={{
                            ...(template === 'dotDensityMap' ? selectedCard : {}),
                          }}
                        onClick={() => setTemplate('dotDensityMap')}
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                Dot Density Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Graduated Symbol Map */}
                    <Box>
                        <Card className = "create-map-card"
                        style={{
                            ...(template === 'graduatedSymbolMap' ? selectedCard : {}),
                          }}
                        onClick={() => setTemplate('graduatedSymbolMap')}
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                Graduated Symbol Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Flow Map */}
                    <Box>
                        <Card className = "create-map-card"
                        style={{
                            ...(template === 'flowMap' ? selectedCard : {}),
                          }}
                        onClick={() => setTemplate('flowMap')}
                        >
                            <CardContent>
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
                 <Box className = "modal-title">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".geojson, .shp, .kml .zip" // Specify the accepted file types
                        id="create-map-input"// Hide the file input
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
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Supported File Types:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        geoJSON, Shapefile, KML:
                    </Typography>
                </Box>
                
                <Box mt={2} id = "create-map-box-create">
                    <Button
                        variant="contained"
                        color="primary"
                        className="login-button"
                        onClick={handleCreateMap}
                    >
                        Create
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}

