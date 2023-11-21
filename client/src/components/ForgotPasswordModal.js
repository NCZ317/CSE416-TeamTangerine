import * as React from 'react';
import { useState, useContext } from 'react';
import {
    Button,
    Modal,
    Box,
    Paper,
    Typography,
} from '@mui/material';
import AuthContext from '../auth';

export default function ForgotPasswordModal({open, onClose}) {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { auth } = useContext(AuthContext);

    const handleForgotPassword = async () => {
        await auth.sendEmail(email,username, password, confirmPassword);
        alert('sent email');
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper
                sx={{

                }}
            >
                <Typography variant="h3" gutterBottom style={{ textAlign: 'center' }}>
                    Forgot Password
                </Typography>
                <Box className = 'create-account-box'>
                    <div>
                        <label htmlFor="email" className='create-account-label'>Email:</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Email"
                            className='custom-long-text-field'
                            onChange={e => {setEmail(e.target.value);}}
                        />
                    </div>
                </Box>
                <Box className = 'create-account-box'>
                    <div>
                        <label htmlFor="email" className='create-account-label'>Username:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            className='custom-long-text-field'
                            onChange={e => {setUsername(e.target.value);}}
                        />
                    </div>
                </Box>
                <Box className = 'create-account-box'>
                    <div>
                        <label htmlFor="email" className='create-account-label'>New Password:</label>
                        <input
                            type="text"
                            id="password"
                            placeholder="Password"
                            className='custom-long-text-field'
                            onChange={e => {setPassword(e.target.value);}}
                        />
                    </div>
                </Box>
                <Box className = 'create-account-box'>
                    <div>
                        <label htmlFor="email" className='create-account-label'>Confirm New Password:</label>
                        <input
                            type="text"
                            id="password"
                            placeholder="Password"
                            className='custom-long-text-field'
                            onChange={e => {setConfirmPassword(e.target.value);}}
                        />
                    </div>
                </Box>
                <Box mt={2} id = 'forgot-password-box'>
                    <span className='forgot-password-span'>
                        A recovery email will be sent if there is an account registered to it
                    </span>
                    <Box id = "forgot-password-box-2" />
                </Box>
                <Box mt={2} className = 'delete-map-box'>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleForgotPassword}
                        className="login-button"
                    >
                        Submit
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}
