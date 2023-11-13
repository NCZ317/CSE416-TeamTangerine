import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import logo from './logo.png';
import LoginModal from './LoginModal';

import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

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

  const handleCreateMap = () => {
    alert('CREATE MAP clicked');
    // Change state
  };

  const handleLogin = () => {
    // Open the LoginModal
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    // Close the LoginModal
    setLoginModalOpen(false);
  };

  function getAccountMenu(loggedIn) {
    let userInitials = auth.getUserInitials();
    console.log("userInitials: " + userInitials);
    if (loggedIn)  
        return <div>{userInitials}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="header">
          <Toolbar>
            <img src={logo} height="50px" style={{ marginBottom: '10px', marginTop: '10px' }} />
            <div style={buttonContainerStyle}>
              {/* <Button color="leaves" variant="text" style={buttonStyle} id="create-map-button" onClick={handleCreateMap}>
                Create Map
              </Button> */}
              {auth.loggedIn ? (
                <Button color="leaves" variant="text" style={buttonStyle} id="create-map-button" onClick={handleCreateMap}>
                  Create Map
                </Button>) : null}

              {/* <Button color="leaves" variant="text" style={buttonStyle} id="login-button" onClick={handleLogin}>
                Login
              </Button> */}

              {/* NEED TO ADD A ICON BUTTON HERE WHEN RENDERING USER INITIALS */}
              {auth.loggedIn ? (getAccountMenu(auth.loggedIn)) : 
              <Button color="leaves" variant="text" style={buttonStyle} id="login-button" onClick={handleLogin}>
                Login
              </Button>}

            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <LoginModal open={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </ThemeProvider>
  );
};

export default AppBanner;
