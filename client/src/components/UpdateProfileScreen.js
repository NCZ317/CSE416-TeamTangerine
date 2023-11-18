import React, { useState, useContext } from 'react';
import { 
    Typography, 
    Box, 
    Grid, 
    IconButton, 
    Popover, 
    List, 
    ListItem,
    ListItemText, 
    Button 
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MapCard from './MapCard';

import AuthContext from '../auth';

const UpdateProfileScreen = ({state, setState}) => {

    const { auth } = useContext(AuthContext);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [email, setEmail] = useState(auth.getUserEmail());
    const [username, setUsername] = useState(auth.getUsername());

    const handleMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
    setMenuAnchorEl(null);
    };

    const handleCancel = () => {
        setState("NONE");
    }

    const handleSave = () => {
        auth.editUser(email,username);
        setState("NONE");
    }
    console.log(username)
    const openMenu = Boolean(menuAnchorEl);
    const menuId = openMenu ? 'menu-popover' : undefined;

    if (state == "NONE") {
        
        return (
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
        )
    }else if (state = "Profile"){
        return(
            <Grid item xs={12} sm={8.5} id = 'profile-grid-2'>
            <Box>
                <Box id = 'profile-box-4'>
                    <Typography variant="h3" id = 'profile-typography-3'>
                        Edit Profile
                    </Typography>
                </Box>
                <div id='profile-div'>
                <Box className="login-inputs">
                    <div>
                    <label htmlFor="email" className='create-account-label'>Email:</label>
                    <input
                        type="text"
                        id="email"
                        placeholder={email}
                        className="login-textfield"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className='login-row'>
                    <label htmlFor="email" className='create-account-label'>Username:</label>
                    <input
                        type="text"
                        id="password"
                        placeholder={username}
                        className="login-textfield"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>
                </Box>

                </div>
                <Box className="login-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        className="login-button"
                        id='sign-up-button'
                        >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCancel}
                        className="login-button"
                        id='sign-up-button'
                        >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Grid>
        )
    }

}

export default UpdateProfileScreen;