import React, { useState } from 'react';
import {
    Button,
    Modal,
    Box,
    TextField,
    Paper,
    Typography,
    Chip
} from '@mui/material';


const customButtonStyle = {
    width: '24%',
    height: 40,
    borderRadius: 24,
    backgroundColor: '#79c200',
    marginTop: 12,
    marginBottom: 12,
    textTransform: 'none',
};


export default function DeleteMapModal() {

    return (
        <Modal open={true} id="delete-map-modal">
            <Paper
                sx={{
                    position: 'absolute',
                    width: 800,
                    height: 200,
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

                <Typography variant="h3" gutterBottom style={{textAlign: 'center'}}>Delete Map?</Typography>
                
                <Box>
                    <Typography
                        variant='h5'
                        style={{textAlign: 'center'}}
                    
                    >Are you sure you wish to permanently delete the map?</Typography>
                </Box>

                <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant="contained" color="primary" style={customButtonStyle}>
                        Confim
                    </Button>
                    <Button variant="contained" color="primary" style={customButtonStyle}>
                        Cancel
                    </Button>
                </Box>

            </Paper>
        </Modal>
    );
}