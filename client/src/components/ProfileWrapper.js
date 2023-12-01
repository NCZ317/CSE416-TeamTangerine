import React, { useState, useContext } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, Grid, 
  IconButton, 
  Popover, 
  List, 
  ListItem, 
  ListItemText,
  Menu,
  MenuItem} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MapCard from './MapCard';
import UpdateProfileScreen from './UpdateProfileScreen'

import AuthContext from '../auth';

const ProfileWrapper = () => {

  const { auth } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [updateInfo, setUpdateInfo] = useState('NONE'); // change profile to update profile: NONE for default, PROFILE for profile, PASSWORD for password

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setUpdateInfo("PROFILE");
    handleSettingsClose();
  }

  const handleChangePassword = () => {
    setUpdateInfo("PASSWORD");
    handleSettingsClose();
  }

  const openSettings = Boolean(anchorEl);


  const settingsId = openSettings ? 'settings-popover' : undefined;

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
            <Menu
            id={settingsId}
            anchorEl={anchorEl}
            open={openSettings}
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
              <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
              <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
            </Menu>            
            <CardContent>
              <Box align="center">
              <Box alignItems="center" className = 'profile-user-circle'>
                <Typography variant="h2" id = 'profile-color'>
                  {auth.loggedIn && auth.getUserInitials()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" className='profile-typography'>
                {auth.loggedIn && auth.user.firstName + " " + auth.user.lastName}
              </Typography>

              <Typography variant="h6" id='profile-typography-2'>
                {auth.loggedIn && "@"+auth.user.username}
              </Typography>

              <Box id='profile-box' className = 'profile-followers'>
                <Box className ='profile-box-2'>
                  <Typography variant="h5">{auth.loggedIn && auth.user.numPosts}</Typography>
                  <Typography variant="h6">Posts</Typography>
                </Box>
                <Box className ='profile-box-2'>
                  <Typography variant="h5">{auth.loggedIn && auth.user.numFollowers}</Typography>
                  <Typography variant="h6">Followers</Typography>
                </Box>
                <Box className ='profile-box-2'>
                  <Typography variant="h5">{auth.loggedIn && auth.user.numFollowing}</Typography>
                  <Typography variant="h6">Following</Typography>
                </Box>
              </Box>
              <Box id = 'profile-box-3' mt={2} className = 'profile-joined'>
                <Typography variant="h5" className='profile-margin'>
                  Joined: {auth.loggedIn && auth.user.dateJoined}
                </Typography>
                {/* NEED TO MODIFY LATER WHEN MAPS ARE PUBLISHED */}
                <Typography variant="h5" className='profile-margin'>
                  Total Likes: 
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <UpdateProfileScreen state = {updateInfo} setState = {setUpdateInfo}/>
      </Grid>
    </div>
  );
};

export default ProfileWrapper;
