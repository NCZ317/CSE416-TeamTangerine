import React, { useState, useEffect, useContext,} from 'react';
import { Box, Card, CardContent, Grid, Typography, TextField, Button, Menu, MenuItem } from '@mui/material';
import MapWrapper from './MapWrapper';
import { styled } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GlobalStoreContext } from '../store/index.js';
import AuthContext from '../auth';
import html2canvas from 'html2canvas';
import 'leaflet/dist/leaflet.css';
import domtoimage from 'dom-to-image';

const PostWrapper = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [liked, setLiked] = useState(false);
    // const [jsonURL, setJSONurl] = useState("");
    // const [jsonFilename, setJSONfilename] = useState("");
    


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
        comments: [],
        views: 0,
        likes: 0,
    });
    
    useEffect(() => {
        console.log(store.currentMap);
        if (store.currentMap) {
            console.log(auth.userToView);
            setMapDetails({
                title: store.currentMap.title,
                author: store.currentMap.username,
                description: store.currentMap.description,
                comments: store.currentMap.comments,
                views: store.currentMap.views,
                likes: store.currentMap.likes,
            });
            // const jsonBlob = new Blob(
            //     [JSON.stringify({"type":store.currentMap.jsonData.type,"features":store.currentMap.jsonData.features})],
            //     { type: 'application/json' }
            //   );
            // console.log(jsonBlob);  
            // // Create a download link for the blob content
            // setJSONurl(URL.createObjectURL(jsonBlob));
            // setJSONfilename(store.currentMap.title + '.json');
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

    const handleFork = async () => {
        alert('forking');
        await store.duplicateMap(store.currentMap._id);
        await store.setScreen("MAP_EDITOR"); 
    }

    let forkButton = "";
    if (auth.user){
        forkButton = <Button id='post-button-2' variant='contained' onClick={handleFork}>Fork</Button>;
    }

    const handleAuthorClick = () => {
        if (auth.userToView) {
            store.setScreen("USER");
        }
    };

    const handleDownloadJSON = () => {
        console.log("DOWNLOADING JSON");
        if (store.currentMap && store.currentMapLayer) {
            const jsonContent = {
                mapType: store.currentMap.mapType,
                jsonData: store.currentMap.jsonData,
                mapLayer: store.currentMapLayer,
            };
            console.log(jsonContent);

            const jsonString = JSON.stringify(jsonContent, null, 2); 
        
            const jsonBlob = new Blob([jsonString], { type: 'application/json' });

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(jsonBlob);
            downloadLink.download = `${store.currentMap.title}.json`; 

            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);
        }
    }
    
    
    const captureMapJPG = () => {
        const mapContainer = document.querySelector('.leaflet-container');
        domtoimage.toJpeg(mapContainer, {backgroundColor: '#f28500' })
            .then((dataUrl) => {
                // Create a link element and trigger a download
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'map.jpg';
                link.click();
            })
            .catch((error) => {
                console.error('Error capturing map:', error);
            });
    };
    const captureMapPNG = () => {
        const mapContainer = document.querySelector('.leaflet-container');
        domtoimage.toPng(mapContainer, {backgroundColor: '#f28500' })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'map.png';
                link.click();
            })
            .catch((error) => {
                console.error('Error capturing map:', error);
            });
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
                                style = {{zIndex: "2000"}}
                            >
                                <MenuItem onClick={captureMapJPG}>JPEG</MenuItem>
                                <MenuItem onClick={captureMapPNG}>PNG</MenuItem>
                                <MenuItem onClick={handleDownloadJSON}>JSON</MenuItem>
                            </Menu>
                            {forkButton} 
                        </Box>
                        <MapWrapper style={{ height: '63vh' }} />
                        <CardContent className='post-card-content'>
                            <Box id='post-box'>
                                <Box className='map-card-box'>
                                    <Typography variant="h4" component="div">
                                        {mapDetails.title}
                                    </Typography>
                                    <Typography variant="h6">
                                        By: <span style={{cursor:'pointer'}} onClick={handleAuthorClick}>{mapDetails.author}</span>
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
