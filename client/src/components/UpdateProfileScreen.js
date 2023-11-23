import React, { useState, useContext, useEffect  } from 'react';
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
import GlobalStoreContext from '../store';

const UpdateProfileScreen = ({state, setState}) => {
    console.log(state)
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);


    let mapList = "";
    if (store) {
        mapList =
            <List>
                {
                    store.idNamePairs.map((pair) => (
                        <MapCard key={pair._id} myMap={true} idNamePair={pair}/>
                    ))
                }
            </List>
    }
    console.log(store.idNamePairs);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const [formData, setFormData] = useState({
        email: auth.getUserEmail(),
        username: auth.getUsername(),
        password: '',
    });

    const [changePass, setChangePass] = useState({
        verifyPass: '',
        newPass: '',
        confirmNewPass: '',
    })

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
        auth.editUser(
            formData.email,
            formData.username,
            formData.password
            );
        setState("NONE");
    }
    const handleSavePass = () => {
        auth.changeUserPassword(
            changePass.verifyPass,
            changePass.newPass,
            changePass.confirmNewPass,
        )
        setState("NONE");
    }
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
                    {mapList}
                </Box>
            </Grid>
        )
    }else if (state == "PROFILE"){
        return(
            <Grid item xs={12} sm={8.5} id = 'profile-grid-2'>
            <Box>
                <Box id = 'profile-box-4'>
                    <Typography variant="h3" id = 'profile-typography-3'>
                        Edit Profile
                    </Typography>
                </Box>
                <div id='profile-div'>
                    <Box className="create-account-box">
                        <div className='create=account-row'>
                            <label className='create-account-label' htmlFor="email">New Email:</label>
                            <input
                            type="text"
                            id="email"
                            placeholder={auth.getUserEmail()}
                            className="custom-long-text-field"
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            autoComplete="off"
                            />
                        </div>
                        <div className='create=account-row'>
                            <label className='create-account-label' htmlFor="username">New Username:</label>
                            <input
                            type="text"
                            id="username"
                            placeholder={auth.getUsername()}
                            className="custom-long-text-field"
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            autoComplete="off"
                            />
                        </div>
                        <div className='create=account-row'>
                            <label className='create-account-label' htmlFor="password">Confirm Password to save changes:</label>
                            <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="custom-long-text-field"
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
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
    }else if (state == "PASSWORD"){
        return(
            <Grid item xs={12} sm={8.5} id = 'profile-grid-2'>
            <Box>
                <Box id = 'profile-box-4'>
                    <Typography variant="h3" id = 'profile-typography-3'>
                        Change Password
                    </Typography>
                </Box>
                <div id='profile-div'>
                    <Box className="create-account-box">
                        <div className='create=account-row'>
                            <label className='create-account-label' htmlFor="password">Current Password:</label>
                            <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="custom-long-text-field"
                            onChange={(e) =>
                                setChangePass({ ...changePass, verifyPass: e.target.value })
                            }
                            />
                        </div>
                        <div className='create=account-row'>
                            <label className='create-account-label' htmlFor="password">New Password:</label>
                            <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="custom-long-text-field"
                            onChange={(e) =>
                                setChangePass({ ...changePass, newPass: e.target.value })
                            }
                            />
                        </div>
                        <div className='create=account-row'>
                            <label className='create-account-label' htmlFor="password">Confirm New Password:</label>
                            <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="custom-long-text-field"
                            onChange={(e) =>
                                setChangePass({ ...changePass, confirmNewPass: e.target.value })
                            }
                            />
                        </div>
                    </Box>
                </div>
                <Box className="login-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSavePass}
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