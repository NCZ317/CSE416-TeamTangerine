import React, { useState, useEffect, useContext } from 'react';
import { Box, Card, CardContent, Grid, Typography, TextField, Button, Menu, MenuItem } from '@mui/material';
import MapWrapper from './MapWrapper';
import { styled } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GlobalStoreContext } from '../store/index.js';
import AuthContext from '../auth';

const PostWrapper = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [liked, setLiked] = useState(false);


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

    useEffect(() => {
        const isMapLiked = auth.user && auth.user.likedMaps.includes(store.currentMap?._id);
        setLiked(isMapLiked); 
        
    }, [store.currentMap, auth.user]);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleLikeClick = () => {
        if (auth.user === null) {
            // You may show a message to prompt the user to log in
            console.log('Please log in to like the map.');
            return;
        }
        setLiked((prevLiked) => !prevLiked);
        if (liked) {
            store.unlike();
            setMapDetails((prevDetails) => ({ ...prevDetails, likes: prevDetails.likes - 1 }));
        } else {
            store.like();
            setMapDetails((prevDetails) => ({ ...prevDetails, likes: prevDetails.likes + 1 }));
        }
    };

    const handleExportMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExportMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCommentKeyDown = (event) => {
        if (event.keyCode === 13) {
            // Prevent the default behavior of the Enter key
            event.preventDefault();

            // Get the trimmed comment text
            const commentText = event.target.value.trim();
            console.log(commentText);

            // Check if the comment is not blank
            if (commentText !== '') {
                // Call store.comment() function here
                store.comment(commentText);

                // Clear the comment text field
                event.target.value = '';
            }
        }
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
                                        <FavoriteIcon
                                            sx={{
                                                cursor: auth.user !== null ? "pointer" : "default",
                                            }}
                                            color={liked ? 'error' : 'inherit'}
                                            onClick={handleLikeClick}
                                        /> {mapDetails.likes}
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
                                disabled={auth.user === null}
                                onKeyDown={handleCommentKeyDown}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default PostWrapper;
