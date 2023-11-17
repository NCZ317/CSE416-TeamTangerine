import React, { useState } from 'react';
import {
    Button,
    Modal,
    Box,
    Paper,
    Typography,
} from '@mui/material';

export default function DeleteMapModal({ open, onClose }) {

    return (
        <Modal open={open} onClose={onClose} id="delete-map-modal">
            <Paper id = "delete-map-paper">
                <Typography variant="h3" gutterBottom className="modal-title">Delete Map?</Typography>
                <Box>
                    <Typography
                        variant='h5'
                        className="modal-title"
                    >Are you sure you wish to permanently delete the map?</Typography>
                </Box>
                <Box mt={2} className="delete-map-box">
                    <Button variant="contained" color="primary" className="login-button">
                        Confirm
                    </Button>
                    <Button variant="contained" color="primary" className="login-button">
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}