import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MapCard from './MapCard';

const ProfileWrapper = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const openSettings = Boolean(anchorEl);
  const openMenu = Boolean(menuAnchorEl);

  const settingsId = openSettings ? 'settings-popover' : undefined;
  const menuId = openMenu ? 'menu-popover' : undefined;

  return (
    <div>
      <Grid container spacing={2} id='profile-grid'>
        <Grid item xs={12} sm={3.5} id='post-height'>
          <Card className='profile-card'>
            <IconButton
              className='profile-settings-button'
              aria-label="settings"
              onClick={handleSettingsClick}
            >
              <SettingsIcon fontSize="large" />
            </IconButton>
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
                <ListItem onClick={handleSettingsClose}>
                  <ListItemText primary="Edit Profile" />
                </ListItem>
                <ListItem onClick={handleSettingsClose}>
                  <ListItemText primary="Change Password" />
                </ListItem>
              </List>
            </Popover>

            <CardContent>
              <Box align="center">
                <Box alignItems="center" className = 'profile-user-circle'>
                  <Typography variant="h2" id = 'profile-color'>
                    JD
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" className='profile-typography'>
                John Doe
              </Typography>

              <Typography variant="h6" id='profile-typography-2'>
                @jdoe21
              </Typography>

              <Box id='profile-box' className = 'profile-followers'>
                <Box className ='profile-box-2'>
                  <Typography variant="h5">10</Typography>
                  <Typography variant="h6">Posts</Typography>
                </Box>
                <Box className ='profile-box-2'>
                  <Typography variant="h5">15</Typography>
                  <Typography variant="h6">Followers</Typography>
                </Box>
                <Box className ='profile-box-2'>
                  <Typography variant="h5">25</Typography>
                  <Typography variant="h6">Following</Typography>
                </Box>
              </Box>
              <Box id = 'profile-box-3' mt={2} className = 'profile-joined'>
                <Typography variant="h5" className='profile-margin'>
                  Joined: January 1, 2023
                </Typography>
                <Typography variant="h5" className='profile-margin'>
                  Total Likes: 165
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={8.5} id = 'profile-grid-2'>
          <Box>
            <Box id = 'profile-box-4'>
              <Typography variant="h3" id = 'profile-typography-3'>
                Private Maps
              </Typography>
              <IconButton
                className='profile-down-button'
                color="primary"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <ArrowDropDownIcon className = 'create-map-cloud-icon'/>
              </IconButton>
              <Popover
                id={menuId}
                open={openMenu}
                anchorEl={menuAnchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <List>
                  <ListItem onClick={handleMenuClose}>
                    <ListItemText primary="Private Maps" />
                  </ListItem>
                  <ListItem onClick={handleMenuClose}>
                    <ListItemText primary="Public Maps" />
                  </ListItem>
                  <ListItem onClick={handleMenuClose}>
                    <ListItemText primary="Liked Maps" />
                  </ListItem>
                </List>
              </Popover>
            </Box>

            <div id='profile-div'>
              <MapCard myMap={true} />
              <MapCard myMap={true}/>
              <MapCard myMap={true}/>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileWrapper;
