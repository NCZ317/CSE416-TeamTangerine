import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import logo from './logo.png';
import LoginModal from './LoginModal';
import CreateMapModal from './CreateMapModal';
import { useNavigate } from 'react-router-dom';
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

const AppBanner = () => {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCreateMapModalOpen, setCreateMapModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);


  const navigate = useNavigate();
  const handleCreateMap = () => {
    store.setScreen("MAP_EDITOR");
    setCreateMapModalOpen(true);
  };

  const handleLogin = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleCloseCreateMapModal = () => {
    setCreateMapModalOpen(false);
  };

  const handleAccountMenuClick = (event) => {
    
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.logoutUser();
    handleAccountMenuClose();
  };

  const handleUserProfile = () => {
    auth.viewUser(auth.user.email);
    auth.userToView = auth.user;
    store.setScreen("USER");
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
            id='account-button'
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
      <Box className="app-banner" sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="header">
          <Toolbar>
            <a href='/' className="logo-link"><img src={logo} alt='map img' height="50px" className="app-logo" /></a>
            <div className="button-container">
              {auth.loggedIn ? (
                <>
                  <Button
                    color="leaves"
                    variant="text"
                    className="create-map-button"
                    onClick={handleCreateMap}
                  >
                    Create Map
                  </Button>
                  {getAccountMenu(auth.loggedIn)}
                </>
              ) : (
                <>
                  <Button color="leaves" variant="text" id = 'app-banner-login-button' className="login-button" onClick={handleLogin}>
                    LOGIN
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
