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
import GlobalStoreContext from '../store';

const ProfileWrapper = () => {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateInfo, setUpdateInfo] = useState('NONE'); // change profile to update profile: NONE for default, PROFILE for profile, PASSWORD for password
  const isOwnProfile = auth.userToView && auth.user && auth.userToView.id === auth.user.id;
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

  let initials = "";
  let name = "";
  let username = ""
  let dateJoined = "";
  let posts = 0;
  let likes = 0;
  let bio = "";
  if (auth.userToView) {
    console.log(auth.userToView.id == auth.user.id);
    posts = store.idNamePairs.filter(entry => entry.published === true).length;
    likes = store.idNamePairs.reduce((sum, entry) => sum + (entry.likes || 0), 0);
    initials += auth.userToView.firstName.charAt(0);
    initials += auth.userToView.lastName.charAt(0);
    name = auth.userToView.firstName + " " + auth.userToView.lastName;
    username = auth.userToView.username;
    dateJoined = intDate(auth.userToView.dateJoined);
    bio = auth.userToView.bio;
  }

  const openSettings = Boolean(anchorEl);

  const settingsId = openSettings ? 'settings-popover' : undefined;

  return (
    <div>
      <Grid container spacing={2} id='profile-grid'>
        <Grid item xs={12} sm={3.5} id='post-height'>
          <Card className='profile-card'>
            {isOwnProfile && (
              <IconButton
                className='profile-settings-button'
                aria-label="settings"
                onClick={handleSettingsClick}
              >
                <SettingsIcon fontSize="large" />
              </IconButton>
            )}

            {/* Render the menu only if it's the user's own profile */}
            {isOwnProfile && (
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
            )}
            <CardContent style={{ height: '80%' }}>
              <Box align="center">
                <Box alignItems="center" className='profile-user-circle'>
                  <Typography variant="h2" id='profile-color'>
                    {initials}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" className='profile-typography'>
                {name}
              </Typography>

              <Typography variant="h6" id='profile-typography-2'>
                {"@" + username}
              </Typography>

              <Box id='profile-box' className='profile-followers'>
                <Box className='profile-box-2'>
                  <Typography variant="h6">Posts</Typography>
                  <Typography variant="h5">{posts}</Typography>
                </Box>
                <Box className='profile-box-2'>
                  <Typography variant="h6">Joined</Typography>
                  <Typography variant="h5">{dateJoined}</Typography>
                </Box>
                <Box className='profile-box-2'>
                  <Typography variant="h6">Likes</Typography>
                  <Typography variant="h5">{likes}</Typography>
                </Box>
              </Box>
              <Box id='profile-box-3' mt={2} className='profile-joined'>
                <Typography variant="h5" className='profile-margin' id='profile-typography-4'>
                  {bio}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <UpdateProfileScreen state={updateInfo} setState={setUpdateInfo} />
      </Grid>
    </div>
  );
};

function intDate(str) {
    const dateObject = new Date(str);
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
}

export default ProfileWrapper;
