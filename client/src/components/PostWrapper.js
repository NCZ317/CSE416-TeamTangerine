import React, { useState, useEffect, useContext } from 'react';
import { Box, Card, CardContent, Grid, Typography, TextField, Button, Menu, MenuItem } from '@mui/material';
import MapWrapper from './MapWrapper';
import { styled } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GlobalStoreContext } from '../store/index.js';

const PostWrapper = () => {
    const { store } = useContext(GlobalStoreContext);

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

    const [mapDetails, setMapDetails] = useState({
        title: "Title",
        author: "User",
        description: "Map description",
        comments: [
            { user: 'User1', message: 'This is the first comment.' },
            { user: 'User2', message: 'Here is another comment.' },
            { user: 'User3', message: 'And one more comment for testing.' },
            { user: 'User4', message: 'This is the sixth comment.' },
            { user: 'User5', message: 'Here is another comment.' },
            { user: 'User6', message: 'And another comment for testing.' },
            { user: 'User7', message: 'Second to last one.' },
            { user: 'User8', message: 'Last one.' },
        ],
        views: 0,
        likes: 0,
    });

    useEffect(() => {
        console.log(store.currentMap);
        if (store.currentMap) {
            setMapDetails({
                title: store.currentMap.title,
                author: store.currentMap.username,
                description: store.currentMap.description,
                comments: store.currentMap.comments,
                views: store.currentMap.views,
                likes: store.currentMap.likes,
            });
        }
    }, [store.currentMap]);
    console.log(mapDetails.title);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleExportMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExportMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className='post-height'>
            <Grid container spacing={2} className='post-height'>
                <Grid item xs={12} sm={9} className='post-height'>
                    <Card className='post-card'>
                        <Box>
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
                        <MapWrapper style={{ height: '63vh' }} />
                        <CardContent className='post-card-content'>
                            <Box id='post-box'>
                                <Box className='map-card-box'>
                                    <Typography variant="h4" component="div">
                                        {mapDetails.title}
                                    </Typography>
                                    <Typography variant="h6">
                                        By: {mapDetails.author}
                                    </Typography>
                                    <Typography variant="body1">
                                        {mapDetails.description}
                                    </Typography>
                                </Box>
                                <Box id='post-box-2'>
                                    <Typography variant="h6" component="div">
                                        <VisibilityOutlinedIcon /> {mapDetails.views}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        <FavoriteIcon /> {mapDetails.likes}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={3} className='post-height'>
                    <Card id='post-card-2'>
                        <CardContent className='post-card-content-2'>
                            <Typography variant="h5" component="div">
                                Comments
                            </Typography>
                            <div className='post-comment-section'>
                                {mapDetails.comments.map((comment, index) => (
                                    <div key={index}>
                                        <Typography variant="h6" className='post-italic'>
                                            {comment.user}:
                                        </Typography>
                                        <Typography variant="body1">
                                            {comment.message}
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
