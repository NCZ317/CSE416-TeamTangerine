import React, { useState, useContext } from 'react';
import GlobalStoreContext from '../store';
import {
    Button,
    Modal,
    Box,
    Paper,
    Typography,
} from '@mui/material';

export default function DeleteMapModal({ open, onClose }) {
    const { store } = useContext(GlobalStoreContext);
    let mapTitle = "";
    if (store.mapMarkedForDeletion) {
        mapTitle = " " + store.mapMarkedForDeletion.title;
    }
    function handleDeleteList(event) {
        event.stopPropagation();
        store.deleteMarkedMap();
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose} id="delete-map-modal">
            <Paper id = "delete-map-paper">
                <Typography variant="h3" gutterBottom className="modal-title">Delete Map?</Typography>
                <Box>
                    <Typography
                        variant='h5'
                        className="modal-title"
                    >Are you sure you wish to permanently delete the map<b>{mapTitle}</b>?</Typography>
                </Box>
                <Box mt={2} className="delete-map-box">
                    <Button variant="contained" color="primary" className="login-button" onClick={handleDeleteList}>
                        Confirm
                    </Button>
                    <Button variant="contained" color="primary" className="login-button" onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}