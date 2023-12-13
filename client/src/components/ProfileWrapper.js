import React, { useState, useContext } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, Grid, 
  IconButton, 
  Menu,
  MenuItem} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import UpdateProfileScreen from './UpdateProfileScreen'

import AuthContext from '../auth';

const ProfileWrapper = () => {
  console.log("2");
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

  const viewUser = (auth.viewAuthor ? (auth.viewAuthor) : auth.user);
  // if (viewUser != auth.user){
  //   console.log("3");
  //   setUpdateInfo("VIEW");
  // }
  console.log("4");
  return (
    <div>
      <Grid container spacing={2} id='profile-grid'>
        <Grid item xs={12} sm={3.5} id='post-height'>
          <Card className='profile-card'>
            {viewUser == auth.user ?<>
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
              </Menu> </>  
            :<></>}         
            <CardContent style = {{height: '80%'}}>
              <Box align="center">
                <Box alignItems="center" className = 'profile-user-circle'>
                  <Typography variant="h2" id = 'profile-color'>
                    {auth.loggedIn && auth.getUserInitialsProfile()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" className='profile-typography'>
                {auth.loggedIn && viewUser.firstName + " " + viewUser.lastName}
              </Typography>

              <Typography variant="h6" id='profile-typography-2'>
                {auth.loggedIn && "@"+viewUser.username}
              </Typography>

              <Box id='profile-box' className = 'profile-followers'>
                <Box className ='profile-box-2'>
                  <Typography variant="h6">Posts</Typography>
                  <Typography variant="h5">{auth.loggedIn && viewUser.numPosts}</Typography>
                </Box>
                <Box className ='profile-box-2'>
                  <Typography variant="h6">Joined</Typography>
                  <Typography variant="h5">{auth.loggedIn && intDate(viewUser.dateJoined)}</Typography>
                </Box>
                <Box className ='profile-box-2'>
                  <Typography variant="h6">Karma</Typography>
                  <Typography variant="h5">{auth.loggedIn && viewUser.numLikes}</Typography>
                </Box>
              </Box>
              <Box id = 'profile-box-3' mt={2} className = 'profile-joined'>
                <Typography variant="h5" className='profile-margin' id  = 'profile-typography-4'>
                  { auth.loggedIn && viewUser.bio}
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

function intDate(str) {
  const event = new Date('November 15, 2023');
  const date = event.toISOString();
  const year = date.split('-')[0];
  const month = date.split('-')[1];
  const day = date.split('-')[2].split('T')[0];
  return month + "/" + day + '/' + year
}

export default ProfileWrapper;
