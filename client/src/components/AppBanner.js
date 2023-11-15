import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from './logo.png';
import LoginModal from './LoginModal';
import CreateMapModal from './CreateMapModal';

import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';

const theme = createTheme({
  palette: {
    leaves: {
      main: '#a85921',
    },
    header: {
      main: '#f18500',
    },
  },
});

const logoStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#7ac100',
  textShadow: '3px  3px  15px  black',
};

const buttonContainerStyle = {
  display: 'flex',
  marginLeft: 'auto', // Align buttons to the right
};

const buttonStyle = {
  marginLeft: '30px', // Adjust margin as needed between buttons
  fontWeight: 'bold',
};

const AppBanner = () => {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCreateMapModalOpen, setCreateMapModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCreateMap = () => {
    //alert('CREATE MAP clicked');
    // Change state
    setCreateMapModalOpen(true);
    console.log(isCreateMapModalOpen);
  };

  const handleLogin = () => {
    // Open the LoginModal
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    // Close the LoginModal
    setLoginModalOpen(false);
  };

  const handleCloseCreateMapModal = () => {
    // Close the CreateMapModal
    setCreateMapModalOpen(false);
  };

  const handleAccountMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Call your logout function from the AuthContext
    auth.logoutUser();
    // Close the menu
    handleAccountMenuClose();
  };

  const handleUserProfile = () => {
    //SHOULD ROUTE TO THE USER'S PROFILE
    store.currentScreen = "USER";
    console.log("currentScreen : "+ store.currentScreen);
    alert("To Profile");
    console.log("To Profile");
    handleAccountMenuClose();
  }

  const getAccountMenu = (loggedIn) => {
    if (loggedIn) {
      return (
        <>
          <IconButton
            size="medium"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            style={{ margin: '0px 0px 0px 24px', backgroundColor: '#D9D9D9', color: '#000' }}
            onClick={handleAccountMenuClick}
          >
            <div>{auth.getUserInitials()}</div>
          </IconButton>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAccountMenuClose}
          >
            <MenuItem onClick={handleUserProfile}>User Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="header">
          <Toolbar>
            <img src={logo} height="50px" style={{ marginBottom: '10px', marginTop: '10px' }} />
            <div style={buttonContainerStyle}>
              {auth.loggedIn ? (
                <>
                  <Button
                    color="leaves"
                    variant="text"
                    style={buttonStyle}
                    id="create-map-button"
                    onClick={handleCreateMap}
                  >
                    Create Map
                  </Button>
                  {getAccountMenu(auth.loggedIn)}
                </>
              ) : (
                <>
                  <Button color="leaves" variant="text" style={buttonStyle} id="login-button" onClick={handleLogin}>
                    Login
                  </Button>
                </>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <LoginModal open={isLoginModalOpen} onClose={handleCloseLoginModal} />
      <CreateMapModal open={isCreateMapModalOpen} onClose={handleCloseCreateMapModal} />
    </ThemeProvider>
  );
};

export default AppBanner;
