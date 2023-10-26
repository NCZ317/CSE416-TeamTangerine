import React from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import logo from './logo.png'
const theme = createTheme({
  palette: {
    leaves: {
      main: '#a85921',
    },
    header: {
        main: '#f18500'
    }
  },
});

const logoStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#7ac100',
  textShadow: "3px  3px  15px  black"
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
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static' color='header'>
          <Toolbar>
            <img src={logo} height='50px' style={{marginBottom: '10px', marginTop: '10px'}}/>
            <div style={buttonContainerStyle}>
              <Button color='leaves' variant='text' style={buttonStyle} id="create-map-button">
                Create Map
              </Button>
              <Button color='leaves' variant='text' style={buttonStyle} id="login-button">
                Login
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default AppBanner;