import * as React from 'react';
import { useState, useRef } from 'react';
import { useContext } from 'react';
import AuthContext from '../auth'
import {
    Button,
    Modal,
    Box,
    TextField,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const cardStyle = {
    minHeight: 200,
    width: 150,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#79c200',
    color: 'white',
    borderRadius: 24
};

const selectedCardStyle = {
    border: '2px solid black'
}

const buttonStyle = {
    margin: '5px 0',
    color: 'white',
    backgroundColor: '#79c200',
    padding: '50px',
    height: 'auto'
}

const customButtonStyle = {
    width: '24%',
    height: 40,
    borderRadius: 24,
    backgroundColor: '#79c200',
    marginTop: 12,
    marginBottom: 12,
    textTransform: 'none',
};

export default function CreateMapModal() {

    const [template, setTemplate] = useState("");
    const fileInputRef = useRef(null);


    const handleFileUpload = () => {
        // Trigger the file input when the IconButton is clicked
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Selected File:', selectedFile);
    };



    return (
        <Modal open={true} id='create-map-modal'>
            <Paper
                sx={{
                    position: 'absolute',
                    width: '50vw',
                    height: '70vh',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '16px',
                }}
            >
                <Typography variant="h3" gutterBottom style={{ textAlign: 'center' }}>
                    Select Template
                </Typography>

                <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    {/* Choropleth Template */}
                    <Box>
                        <Card
                        style={{
                            ...cardStyle,
                            ...(template === 'choroplethMap' ? selectedCardStyle : {}),
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
                        <Card
                        style={{
                            ...cardStyle,
                            ...(template === 'heatMap' ? selectedCardStyle : {}),
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
                        <Card
                        style={{
                            ...cardStyle,
                            ...(template === 'dotDensityMap' ? selectedCardStyle : {}),
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
                        <Card
                        style={{
                            ...cardStyle,
                            ...(template === 'graduatedSymbolMap' ? selectedCardStyle : {}),
                          }}
                        onClick={() => setTemplate('graduatedSymbolMap')}
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                Graduated Sybmol Map
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Flow Map */}
                    <Box>
                        <Card
                        style={{
                            ...cardStyle,
                            ...(template === 'flowMap' ? selectedCardStyle : {}),
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

                <Typography variant="h3" gutterBottom style={{ marginTop: 20, textAlign: 'center' }}>
                    Upload File
                </Typography>

                 {/* Upload Button */}
                 <Box textAlign="center">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".geojson, .shp, .kml .zip" // Specify the accepted file types
                        style={{ display: 'none' }} // Hide the file input
                        onChange={handleFileChange}
                    />
                    <IconButton
                        variant="contained"
                        style={buttonStyle}
                        disabled={template === ''}
                        onClick={handleFileUpload}
                    >
                        <CloudUploadIcon fontSize='large' />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Supported File Types:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        geoJSON, Shapefile, KML:
                    </Typography>
                </Box>
                
                <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={customButtonStyle}
                        // onClick={handleCreateMap}
                    >
                        Create
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}

