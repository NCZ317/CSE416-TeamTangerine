import React, { useState, useContext } from 'react';
import { 
    Typography, 
    Box, 
    Grid,  
    Button 
} from '@mui/material';

import AuthContext from '../auth';
import GlobalStoreContext from '../store';

const ResetPasswordScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const url = new URL(window.location);
    console.log(url.search);
    const split = url.search.split("//");
    const user = split[0].substring(1);
    const password = split[1].trim();
    console.log(user);
    console.log(password);
    const [changePass, setChangePass] = useState({
        email: user,
        verifyPassword: password,
        newPass: '',
        confirmNewPass: '',
    })
    const handleSavePass = () => {
        auth.resetPassword(
            changePass.email,
            changePass.verifyPassword,
            changePass.newPass,
            changePass.confirmNewPass,
        )
        store.setScreen("HOME")
    }
    
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
            </Box>
        </Box>
    </Grid>
    )

}

export default ResetPasswordScreen;