import React from 'react';
import { Box, Card, CardContent, Grid, Typography, TextField, Button } from '@mui/material';
import MapWrapper from './MapWrapper';
import AppBanner from './AppBanner';
import { alpha, styled } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
        flex: '1', // Fill remaining space
        display: 'flex',
        flexDirection: 'column',
    };

    const cardContentStyle2 = {
        color: '#fff',
        backgroundColor: "#A85821",
        textAlign: 'center',
        padding: '18px',
        borderRadius: '25px',
        display: 'flex',
        flexDirection: 'column',
        flex: 'none', 
        height: '552px', 
        position: 'relative',
    };

    const commentSectionStyle = {
        marginTop: '8px',
        borderRadius: '8px',
        padding: '16px',
        height: '100%', 
        overflow: 'auto'
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

    return (
        <div style={{ height: '100%' }}>
            <AppBanner />
            <Grid container spacing={2} style={{ height: '100%' }}>
                <Grid item xs={12} sm={9} style={{ height: '100%' }}>
                    <Card style={cardStyle}>
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
                                        Views: 100
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        Likes: 50
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
                                {/* Add your comments here */}
                                <div>Comment 1</div>
                                <div>Comment 2</div>
                                {/* You can map over comments here */}
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
