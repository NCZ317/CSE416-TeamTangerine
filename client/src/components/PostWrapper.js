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
    const cardStyle = {
        margin: '20px',
        borderRadius: '25px',
        backgroundColor: '#F28500',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    };

    const cardContentStyle = {
        color: '#542C11',
        textAlign: 'left',
        padding: '18px',
        marginLeft: '8px',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
    };

    const cardContentStyle2 = {
        color: '#fff',
        backgroundColor: "#A85821",
        textAlign: 'center',
        padding: '12px',
        borderRadius: '25px',
        display: 'flex',
        flexDirection: 'column',
        flex: 'none',
        height: '565px',
        position: 'relative',
    };

    const commentSectionStyle = {
        marginTop: '6px',
        borderRadius: '8px',
        padding: '12px',
        height: '100%',
        overflow: 'auto',
        textAlign: 'left',
    };

    const italicizedUserName = {
        fontStyle: 'italic', 
    };

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
        <div style={{ height: '100%' }}>
            {/* <AppBanner /> */}
            <Grid container spacing={2} style={{ height: '100%' }}>
                <Grid item xs={12} sm={9} style={{ height: '100%' }}>
                    <Card style={cardStyle}>
                        <Box
                            style={{display: 'flex', justifyContent: 'space-between', padding: '15px'}}
                        
                        >
                            <Box>
                                <Button style={{backgroundColor: '#79C200'} } onClick={handleExportMenuOpen} variant='contained'>Export Map</Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleExportMenuClose}
                                >
                                    <MenuItem>JPEG</MenuItem>
                                    <MenuItem>PNG</MenuItem>
                                    <MenuItem>JSON</MenuItem>
                                </Menu>
                            </Box>
                            <Box>
                                <Button style={{backgroundColor: '#79C200'}} variant = 'contained'>Fork</Button>
                            </Box>
                        </Box>
                    
                        <MapWrapper />
                        <CardContent style={cardContentStyle}>
                            <Box display="flex" flexDirection="row" justifyContent="space-between">
                                <Box display="flex" flexDirection="column">
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
                                <Box display="flex" flexDirection="column" alignItems="left" style={{ marginRight: '12px' }}>
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

                <Grid item xs={12} sm={3} style={{ height: '100%' }}>
                    <Card style={{
                        margin: '20px',
                        borderRadius: '25px',
                        backgroundColor: '#F28500',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}>
                        <CardContent style={cardContentStyle2}>
                            <Typography variant="h5" component="div">
                                Comments
                            </Typography>
                            <div style={commentSectionStyle}>
                                {comments.map((comment, index) => (
                                    <div key={index}>
                                        <Typography variant="h6" sx={italicizedUserName}>
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
