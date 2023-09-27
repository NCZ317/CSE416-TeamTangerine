import React from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const theme = createTheme({
  palette: {
    leaves: {
      main: '#63CD32',
      light: '#79c200',
      dark: '#71b427',
      contrastText: 'whitesmoke',
    },
    header: {
        main: '#F28500'
    }
  },
});

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: 'whitesmoke', // Replace with your desired text color
};

const buttonContainerStyle = {
  display: 'flex',
  marginLeft: 'auto', // Align buttons to the right
};

const buttonStyle = {
  marginLeft: '30px', // Adjust margin as needed between buttons
};

const Header = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static' color='header'>
          <Toolbar>
            <div style={logoStyle}>TerraTrove</div>
            <div style={buttonContainerStyle}>
              <Button color='leaves' variant='contained' style={buttonStyle} id="create-map-button">
                Create Map
              </Button>
              <Button color='leaves' variant='contained' style={buttonStyle} id="login-button">
                Login
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default Header;
