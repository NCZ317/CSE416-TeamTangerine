import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MapCard from './MapCard';

const ProfileWrapper = () => {
  const cardStyle = {
    borderRadius: '25px',
    backgroundColor: '#F28500',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative'
  };

  const followersBox = {
    backgroundColor: '#F6A440',
    borderRadius: '15px',
    padding: '10px 2px 10px 2px',
  };

  const joinedBox = {
    backgroundColor: '#F6A440',
    borderRadius: '15px',
    padding: '10px 2px 10px 2px',
    height: '50%',
  };

  const userCircleStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#D9D9D9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '8px',
  };

  const settingsButtonStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'transparent',
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const openSettings = Boolean(anchorEl);
  const settingsId = openSettings ? 'settings-popover' : undefined;

  return (
    <div>
      <Grid container spacing={2} style={{ height: '690px', padding: '16px 12px 16px 12px' }}>
        <Grid item xs={12} sm={3.5} style={{ height: '100%' }}>
          <Card style={cardStyle}>
            <IconButton
              style={settingsButtonStyle}
              aria-label="settings"
              onClick={handleSettingsClick}
            >
              <SettingsIcon fontSize="large" />
            </IconButton>

            {/* Settings dropdown */}
            <Popover
              id={settingsId}
              open={openSettings}
              anchorEl={anchorEl}
              onClose={handleSettingsClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <List>
                <ListItem button onClick={handleSettingsClose}>
                  <ListItemText primary="Edit Profile" />
                </ListItem>
                <ListItem button onClick={handleSettingsClose}>
                  <ListItemText primary="Change Password" />
                </ListItem>
              </List>
            </Popover>

            <CardContent>
              <Box align="center">
                <Box alignItems="center" style={userCircleStyle}>
                  <Typography variant="h2" style={{ color: '#000' }}>
                    JD
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" align="center">
                John Doe
              </Typography>

              <Typography variant="h6" align="center" style={{ margin: '0px 0px 8px 0px' }}>
                @jdoe21
              </Typography>

              <Box display="flex" justifyContent="center" sx={followersBox}>
                <Box flex={1} textAlign="center">
                  <Typography variant="h5">10</Typography>
                  <Typography variant="h6">Posts</Typography>
                </Box>
                <Box flex={1} textAlign="center">
                  <Typography variant="h5">15</Typography>
                  <Typography variant="h6">Followers</Typography>
                </Box>
                <Box flex={1} textAlign="center">
                  <Typography variant="h5">25</Typography>
                  <Typography variant="h6">Following</Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="left" mt={2} sx={joinedBox}>
                <Typography variant="h5" style={{ margin: '12px' }}>
                  Joined: January 1, 2023
                </Typography>
                <Typography variant="h5" style={{ margin: '12px' }}>
                  Total Likes: 165
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right-hand side container for Private Maps */}
        <Grid item xs={12} sm={8.5} style={{ height: '100%', overflowY: 'auto' }}>
          <Box>
            {/* Typography header for Private Maps */}
            <Typography variant="h4" style={{ marginBottom: '8px' }}>
              Private Maps
            </Typography>

            {/* Container for MapCards */}
            {/* You can replace the following div with your MapCards component */}
            <div style={{ height: 'calc(100% - 32px)', overflowY: 'auto' }}>
              {/* MapCards go here */}
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileWrapper;
