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

const customTextFieldStyle = {
    width: 600,
    height: 40,
    display: 'block',
    margin: '0 auto',
    borderRadius: 24,
    backgroundColor: '#d9d9d9',
    color: '#000',
    outline: 'none',
    border: 'none',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 6,
};

const customButtonStyle = {
    width: '24%',
    height: 40,
    borderRadius: 24,
    backgroundColor: '#79c200',
    marginTop: 12,
    marginBottom: 12,
    textTransform: 'none',
};

export default function EditDetailsModal() {

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


    return (
        <>
            <Modal open={true} id="edit-details-modal">
                <Paper
                    sx={{
                        position: 'absolute',
                        width: 700,
                        height: 'auto',
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
                        Edit Map Details
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        <div>
                            <label htmlFor="map-title" style={{ paddingLeft: '36px' }}>
                                Title:
                            </label>
                            <input
                                id="map-title"
                                type="text"
                                style={customTextFieldStyle}
                            />
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <label htmlFor="map-tags" style={{ paddingLeft: '36px' }}>
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
                                style={customTextFieldStyle}
                            />
                            {tags.map((tag, index) => (
                                <Chip
                                key={index}
                                label={tag}
                                onDelete={() => handleDeleteTag(tag)}
                                style={{ margin: '4px' }}
                                />
                            ))}
                        </div>
                        <div>
                            <label htmlFor="map-description" style={{ paddingLeft: '36px' }}>
                                Description:
                            </label>
                            <input
                                id="map-description"
                                type="text"
                                style={customTextFieldStyle}
                            />
                        </div>
                    </Box>

                    <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button variant="contained" color="primary" style={customButtonStyle}>
                            Save
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </>
    );
}

