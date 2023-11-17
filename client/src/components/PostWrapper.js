import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, TextField, Button, Menu, MenuItem } from '@mui/material';
import MapWrapper from './MapWrapper';
import AppBanner from './AppBanner';
import { styled } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

/* THIS IS SAMPLE DATA */
const comments = [
    { userName: 'User1', comment: 'This is the first comment.' },
    { userName: 'User2', comment: 'Here is another comment.' },
    { userName: 'User3', comment: 'And one more comment for testing.' },
    { userName: 'User4', comment: 'This is the sixth comment.' },
    { userName: 'User5', comment: 'Here is another comment.' },
    { userName: 'User6', comment: 'And another comment for testing.' },
    { userName: 'User7', comment: 'Second to last one.' },
    { userName: 'User8', comment: 'Last one.' },
];

const PostWrapper = () => {

    const CssTextField = styled(TextField)({
        '& label.Mui-focused': {
            color: '#fff',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#fff',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#fff',
            },
            '&:hover fieldset': {
                borderColor: '#fff',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#fff',
            },
        },
    });

    const [anchorEl, setAnchorEl] = useState(null);

    const handleExportMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExportMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className='post-height'>
            {/* <AppBanner /> */}
            <Grid container spacing={2} className='post-height'>
                <Grid item xs={12} sm={9} className='post-height'>
                    <Card className='post-card'>
                        <Box >
                            <Button id='post-button' onClick={handleExportMenuOpen} variant='contained'>Export Map</Button>
                            <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleExportMenuClose}
                                >
                                    <MenuItem>JPEG</MenuItem>
                                    <MenuItem>PNG</MenuItem>
                                    <MenuItem>JSON</MenuItem>
                                </Menu>
                            <Button id='post-button-2' variant='contained'>Fork</Button>
                        </Box>   
                        <MapWrapper className = 'leaflet-container'/>
                        <CardContent className='post-card-content'>
                            <Box id = 'post-box'>
                                <Box className ='map-card-box'>
                                    <Typography variant="h4" component="div">
                                        Title
                                    </Typography>
                                    <Typography variant="h6">
                                        Author: User1
                                    </Typography>
                                    <Typography variant="body1">
                                        Map of Asia
                                    </Typography>
                                </Box>
                                <Box id = 'post-box-2'>
                                    <Typography variant="h6" component="div">
                                        <VisibilityOutlinedIcon /> 100
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        <FavoriteIcon /> 50
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                        
                    </Card>
                </Grid>

                <Grid item xs={12} sm={3} className='post-height'>
                    <Card className='post-card-2'>
                        <CardContent className='post-card-content-2'>
                            <Typography variant="h5" component="div">
                                Comments
                            </Typography>
                            <div className='post-comment-section'>
                                {comments.map((comment, index) => (
                                    <div key={index}>
                                        <Typography variant="h6" className='post-italic'>
                                            {comment.userName}:
                                        </Typography>
                                        <Typography variant="body1">
                                            {comment.comment}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                            <CssTextField
                                id="comment"
                                label="Add a comment"
                                variant="outlined"
                                margin="normal"
                                sx={{
                                    input: { color: 'white' },
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default PostWrapper;
