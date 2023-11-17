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

export default function EditDetailsModal({ open, onClose }) {

    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = () => {
        if (inputValue.trim() !== '' && !tags.includes(inputValue)) {
            setTags((prevTags) => [...prevTags, inputValue]);
            setInputValue('');
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
    };

    const handleSaveEdits = () =>{
        alert("Saved Changes");
    };

    return (
        <>
            <Modal open={open} onClose={onClose} id="edit-details-modal">
                <Paper id = "edit-details-paper">
                    <Typography variant="h3" gutterBottom className="modal-title">
                        Edit Map Details
                    </Typography>
                    <Box id = "edit-details-box">
                        <div>
                            <label htmlFor="map-title" className="create-account-label">
                                Title:
                            </label>
                            <input
                                id="map-title"
                                type="text"
                                className="custom-long-text-field"
                            />
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <label htmlFor="map-tags" className="create-account-label">
                                Tags:
                            </label>
                            <input
                                id='map-tags'
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTag();
                                }
                                }}
                                className="custom-long-text-field"
                            />
                            {tags.map((tag, index) => (
                                <Chip
                                key={index}
                                label={tag}
                                onDelete={() => handleDeleteTag(tag)}
                                className='edit-details-chip'
                                />
                            ))}
                        </div>
                        <div>
                            <label htmlFor="map-description" className="create-account-label">
                                Description:
                            </label>
                            <input
                                id="map-description"
                                type="text"
                                className="custom-long-text-field"
                            />
                        </div>
                    </Box>

                    <Box mt={2} className = 'delete-map-box'>
                        <Button variant="contained" color="primary" className="login-button" onClick={handleSaveEdits}>
                            Save
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </>
    );
}

