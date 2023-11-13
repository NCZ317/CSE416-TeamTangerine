import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBanner from './AppBanner';

const ProfileWrapper = () => {
    const cardStyle = {
        borderRadius: '25px',
        backgroundColor: '#F28500',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    };

    const followersBox = {
        backgroundColor: '#F6A440', 
        borderRadius: '15px',
        padding: '10px 2px 10px 2px' 
    };

    return (
        <div>
            {/* <AppBanner /> */}
            <Grid container spacing={2} style={{ height: '100%', padding: '16px 12px 16px 12px' }}>
                <Grid item xs={12} sm={4} style={{ height: '100%' }}>
                    <Card style={cardStyle}>
                        <CardContent>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <AccountCircleIcon fontSize="large" />
                            </Box>

                            <Typography variant="h6" align="center">
                                John Doe
                            </Typography>

                            <Typography variant="subtitle1" align="center">
                                @jdoe21
                            </Typography>

                            <Box display="flex" justifyContent="center" sx={followersBox}>
                                <Box flex={1} textAlign="center">
                                    <Typography variant="h6">10</Typography>
                                    <Typography variant="body2">Posts</Typography>
                                </Box>
                                <Box flex={1} textAlign="center">
                                    <Typography variant="h6">15</Typography>
                                    <Typography variant="body2">Followers</Typography>
                                </Box>
                                <Box flex={1} textAlign="center">
                                    <Typography variant="h6">25</Typography>
                                    <Typography variant="body2">Following</Typography>
                                </Box>
                            </Box>

                            {/* Horizontal Line */}
                            <Divider variant="middle" />

                            {/* Date Joined */}
                            <Box display="flex" justifyContent="center" mt={2} sx={followersBox}>
                                <Typography variant="body2">
                                    Joined: January 1, 2023
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProfileWrapper;
