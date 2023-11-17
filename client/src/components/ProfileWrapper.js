import React, { useState, useContext } from 'react';
import { Card, CardContent, Typography, Box, Grid, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MapCard from './MapCard';

import AuthContext from '../auth';

const ProfileWrapper = () => {

  const { auth } = useContext(AuthContext);

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
    color: '#542C11',
    borderRadius: '15px',
    padding: '10px 2px 10px 2px',
  };

  const joinedBox = {
    backgroundColor: '#F6A440',
    color: '#542C11',
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

  const downButtonStyle = {
    backgroundColor: 'transparent',
    color: '#79C200'
  };

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

  console.log("LOGGED IN: " + auth.loggedIn);

  return (
    <div>
      <Grid container spacing={2} style={{ height: '690px', padding: '16px 12px 16px 12px' }}>
        <Grid item xs={12} sm={3.5} style={{ height: '100%'}}>
          <Card style={cardStyle}>
            <IconButton
              style={settingsButtonStyle}
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
                    {auth.loggedIn && auth.getUserInitials()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" align="center" color={'#542C11'}>
                {auth.loggedIn && auth.user.firstName + " " + auth.user.lastName}
              </Typography>

              <Typography variant="h6" align="center" color={'#542C11'} style={{ margin: '0px 0px 8px 0px' }}>
                {auth.loggedIn && auth.user.username}
              </Typography>

              <Box display="flex" justifyContent="center" sx={followersBox}>
                <Box flex={1} textAlign="center">
                  <Typography variant="h5">{auth.loggedIn && auth.user.numPosts}</Typography>
                  <Typography variant="h6">Posts</Typography>
                </Box>
                <Box flex={1} textAlign="center">
                  <Typography variant="h5">{auth.loggedIn && auth.user.numFollowers}</Typography>
                  <Typography variant="h6">Followers</Typography>
                </Box>
                <Box flex={1} textAlign="center">
                  <Typography variant="h5">{auth.loggedIn && auth.user.numFollowing}</Typography>
                  <Typography variant="h6">Following</Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="left" mt={2} sx={joinedBox}>
                <Typography variant="h5" style={{ margin: '12px' }}>
                  Joined: {auth.loggedIn && auth.user.dateJoined}
                </Typography>
                {/* NEED TO MODIFY LATER WHEN MAPS ARE PUBLISHED */}
                <Typography variant="h5" style={{ margin: '12px' }}>
                  Total Likes:
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={8.5} style={{ height: '100%', overflowY: 'auto' }}>
          <Box>
            <Box display="flex" alignItems="center" justifyContent="center" style={{ width: '100%'}}>
              <Typography variant="h3" style={{ marginBottom: '8px', color:'#F28500', fontWeight: 'bold' }}>
                Private Maps
              </Typography>
              <IconButton
                style={downButtonStyle}
                color="primary"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <ArrowDropDownIcon fontSize='large' />
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
                  <ListItem button onClick={handleMenuClose}>
                    <ListItemText primary="Private Maps" />
                  </ListItem>
                  <ListItem button onClick={handleMenuClose}>
                    <ListItemText primary="Public Maps" />
                  </ListItem>
                  <ListItem button onClick={handleMenuClose}>
                    <ListItemText primary="Liked Maps" />
                  </ListItem>
                </List>
              </Popover>
            </Box>

            <div style={{ height: 'calc(100% - 32px)', overflowY: 'auto' }}>
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
