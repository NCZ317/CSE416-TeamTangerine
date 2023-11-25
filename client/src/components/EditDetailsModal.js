import React, { useState, useContext } from 'react';
import {
    Button,
    Modal,
    Box,
    Paper,
    Typography,
    Checkbox,
    FormControl,
    FormGroup,
    FormControlLabel
} from '@mui/material';

import { GlobalStoreContext } from '../store';

const regionOptions = [
    { label: 'Americas', value: 'Americas' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Africa', value: 'Africa' },
    { label: 'Asia', value: 'Asia' },
    { label: 'Australia', value: 'Australia' },
];

export default function EditDetailsModal({ idNamePair, open, onClose }) {
    const { store } = useContext(GlobalStoreContext);

    const [title, setTitle] = useState(idNamePair.title);
    const [regions, setRegions] = useState(idNamePair.regions);
    const [description, setDescription] = useState(idNamePair.description);

    const handleSaveEdits = (onClose) => {
        store.updateMapDetailsById(idNamePair._id, title, regions, description);
        onClose();
    };

    return (
        <>
            <Modal open={open} onClose={onClose} id="edit-details-modal">
                <Paper id="edit-details-paper">
                    <Typography variant="h3" gutterBottom className="modal-title">
                        Edit Map Details
                    </Typography>
                    <Box id="edit-details-box">
                        <div>
                            <label htmlFor="map-title" className="create-account-label">
                                Title:
                            </label>
                            <input
                                id="map-title"
                                type="text"
                                className="custom-long-text-field"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <label htmlFor="map-regions" className='create-account-label'>
                                Regions:
                            </label>
                            <div>
                                <FormControl>
                                    <FormGroup id='region-checkboxes' >
                                        {regionOptions.map((region) => (
                                            <FormControlLabel
                                                key={region.value}
                                                control={
                                                    <Checkbox
                                                        checked={regions.includes(region.value)}
                                                        onChange={() => {
                                                            setRegions((prevRegions) => {
                                                                console.log("Previous Regions:", prevRegions);
                                                                const updatedRegions = prevRegions.includes(region.value)
                                                                    ? prevRegions.filter((r) => r !== region.value)
                                                                    : [...prevRegions, region.value];
                                                        
                                                                console.log("Updated Regions:", updatedRegions);
                                                                setRegions(updatedRegions);
                                                                return updatedRegions;
                                                            });
                                                        }}
                                                    />
                                                }
                                                label={region.label}
                                                style={{ marginRight: '20px' }}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="map-description" className="create-account-label">
                                Description:
                            </label>
                            <input
                                id="map-description"
                                type="text"
                                className="custom-long-text-field"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </Box>

                    <Box mt={2} className='delete-map-box'>
                        <Button variant="contained" color="primary" className="login-button" onClick={() => handleSaveEdits(onClose)}>
                            Save
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </>
    );
}
